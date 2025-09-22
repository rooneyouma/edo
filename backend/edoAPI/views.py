from rest_framework.generics import ListAPIView, RetrieveAPIView, CreateAPIView, RetrieveUpdateAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics, permissions, viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import User, LandlordProperty, Role, Unit, Tenant, Payment, Notice, LandlordMaintenance, MaintenanceMessage, ChatMessage, TenantInvitation
from .serializers import UserSerializer, UserRegistrationSerializer, UserLoginSerializer, LandlordPropertySerializer, UnitSerializer, TenantSerializer, PaymentSerializer, NoticeSerializer, LandlordMaintenanceSerializer, MaintenanceMessageSerializer, ChatMessageSerializer, TenantInvitationSerializer
from rest_framework.decorators import api_view, permission_classes
from django.db import models
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings
from rest_framework import serializers

def send_tenant_invitation_email(invitation):
    """
    Send invitation email to tenant with both account creation and quick approval options
    """
    subject = f"Tenant Invitation - {invitation.unit.property.name} Unit {invitation.unit.unit_id}"
    
    # Create invitation URLs
    base_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:3000')
    create_account_url = f"{base_url}/accept-invitation/{invitation.invitation_code}?action=create_account"
    quick_approve_url = f"{base_url}/accept-invitation/{invitation.invitation_code}?action=approve"
    
    message = f"""
Hello,

You have been invited to become a tenant at {invitation.unit.property.name} Unit {invitation.unit.unit_id}.

Property Details:
- Property: {invitation.unit.property.name}
- Unit: {invitation.unit.unit_id}
- Monthly Rent: ${invitation.unit.rent_amount}
- Landlord: {invitation.landlord.get_full_name()}

You have two options to accept this invitation:

1. CREATE ACCOUNT (Recommended):
   - Access the full tenant portal
   - Submit maintenance requests
   - Pay rent online
   - Message your landlord
   - View your rental information
   
   Click here: {create_account_url}

2. QUICK APPROVE:
   - Simple approval without creating an account
   - Basic tenant record created
   - No platform access required
   
   Click here: {quick_approve_url}

{f"Personal Message from your landlord: {invitation.message}" if invitation.message else ""}

This invitation expires on {invitation.expires_at.strftime('%B %d, %Y')}.

If you have any questions, please contact your landlord.

Best regards,
The Edo Real Estate Team
    """
    
    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[invitation.email],
            fail_silently=False,
        )
        return True
    except Exception as e:
        print(f"Error sending invitation email: {e}")
        return False

class UserListView(ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class UserDetailView(RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

class UserProfileView(RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return self.request.user

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        data = request.data.copy()
        if 'profile_image' in request.FILES:
            data['profile_image'] = request.FILES['profile_image']
        serializer = self.get_serializer(instance, data=data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

class UserRegistrationView(CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            if serializer.is_valid():
                user = serializer.save()
                
                # Generate tokens
                refresh = RefreshToken.for_user(user)
                
                return Response({
                    'message': 'User registered successfully',
                    'user': UserSerializer(user, context={'request': request}).data,
                    'tokens': {
                        'access': str(refresh.access_token),
                        'refresh': str(refresh),
                    }
                }, status=status.HTTP_201_CREATED)
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(f"Registration error: {e}")
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class UserLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            serializer = UserLoginSerializer(data=request.data)
            if serializer.is_valid():
                user = serializer.validated_data['user']
                
                # Generate tokens
                refresh = RefreshToken.for_user(user)
                
                return Response({
                    'message': 'Login successful',
                    'user': UserSerializer(user, context={'request': request}).data,
                    'tokens': {
                        'access': str(refresh.access_token),
                        'refresh': str(refresh),
                    }
                }, status=status.HTTP_200_OK)
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(f"Login error: {e}")
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class IsLandlord(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.roles.filter(name='landlord').exists()

    def has_object_permission(self, request, view, obj):
        return obj.landlord == request.user

class IsHost(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.roles.filter(name='host').exists()

class IsTenant(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.roles.filter(name='tenant').exists()

class HasRolePermission(permissions.BasePermission):
    """
    Generalized permission class to check if a user has a specific role.
    Usage: set required_role on the view, e.g. required_role = 'landlord'
    """
    def has_permission(self, request, view):
        required_role = getattr(view, 'required_role', None)
        if not request.user.is_authenticated or not required_role:
            return False
        return request.user.has_role(required_role)

class OnboardRoleView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """
        Add a role to the authenticated user. Expects {"role": "role_name"} in POST data.
        """
        user = request.user
        role_name = request.data.get('role')
        if not role_name:
            return Response({'error': 'Role name is required.'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            role = Role.objects.get(name=role_name)
        except Role.DoesNotExist:
            return Response({'error': f'Role "{role_name}" does not exist.'}, status=status.HTTP_400_BAD_REQUEST)
        user.roles.add(role)
        user.save()
        return Response({'message': f'User is now a {role_name}', 'roles': list(user.roles.values_list('name', flat=True))})

class LandlordPropertyListCreateView(generics.ListCreateAPIView):
    serializer_class = LandlordPropertySerializer
    permission_classes = [IsLandlord]

    def get_queryset(self):
        return LandlordProperty.objects.filter(landlord=self.request.user)

    def perform_create(self, serializer):
        serializer.save(landlord=self.request.user)

class LandlordPropertyDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = LandlordPropertySerializer
    permission_classes = [IsLandlord]
    lookup_field = 'id'

    def get_queryset(self):
        return LandlordProperty.objects.filter(landlord=self.request.user)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def become_landlord(request):
    user = request.user
    landlord_role, _ = Role.objects.get_or_create(name='landlord')
    user.roles.add(landlord_role)
    user.save()
    return Response({'message': 'User is now a landlord', 'roles': list(user.roles.values_list('name', flat=True))})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def become_tenant(request):
    user = request.user
    tenant_role, _ = Role.objects.get_or_create(name='tenant')
    user.roles.add(tenant_role)
    user.save()
    return Response({'message': 'User is now a tenant', 'roles': list(user.roles.values_list('name', flat=True))})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def become_host(request):
    user = request.user
    host_role, _ = Role.objects.get_or_create(name='host')
    user.roles.add(host_role)
    user.save()
    return Response({'message': 'User is now a host', 'roles': list(user.roles.values_list('name', flat=True))})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def relinquish_role(request):
    """
    Allow a user to relinquish a specific exclusive role (host, landlord, tenant).
    If relinquished, assign 'regular' if no other exclusive role remains.
    """
    user = request.user
    role_name = request.data.get('role')
    if not role_name:
        return Response({'error': 'Role name is required.'}, status=status.HTTP_400_BAD_REQUEST)
    role_name = role_name.strip().lower()  # Normalize input
    if role_name not in ['host', 'tenant', 'landlord']:
        return Response({'error': 'Invalid or non-relinquishable role.'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        role = Role.objects.get(name__iexact=role_name)  # Case-insensitive lookup
    except Role.DoesNotExist:
        return Response({'error': f'Role "{role_name}" does not exist.'}, status=status.HTTP_400_BAD_REQUEST)
    if not user.roles.filter(name__iexact=role_name).exists():
        return Response({'error': f'User does not have the role "{role_name}".'}, status=status.HTTP_400_BAD_REQUEST)
    # Remove the role
    user.roles.remove(role)
    # If user has no other exclusive role, assign 'regular'
    exclusive_roles = ['host', 'tenant', 'landlord', 'admin']
    if not user.roles.filter(name__in=exclusive_roles).exists():
        regular_role, _ = Role.objects.get_or_create(name='regular')
        user.roles.set([regular_role])
    user.save()
    return Response({'message': f'Role "{role_name}" relinquished. You are now a regular user.', 'roles': list(user.roles.values_list('name', flat=True))}, status=status.HTTP_200_OK)

class LandlordPropertyViewSet(viewsets.ModelViewSet):
    queryset = LandlordProperty.objects.all()
    serializer_class = LandlordPropertySerializer

class UnitViewSet(viewsets.ModelViewSet):
    serializer_class = UnitSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Only show units for properties owned by the requesting user
        return Unit.objects.filter(property__landlord=self.request.user)

class TenantViewSet(viewsets.ModelViewSet):
    serializer_class = TenantSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Only show tenants for units owned by the requesting user
        return Tenant.objects.filter(unit__property__landlord=self.request.user)

    def perform_destroy(self, instance):
        # Update unit status to vacant when tenant is deleted
        unit = instance.unit
        unit.status = 'vacant'
        unit.save()
        instance.delete()

    def create(self, request, *args, **kwargs):
        try:
            # Extract data from request
            email = request.data.get('email')
            first_name = request.data.get('first_name')
            last_name = request.data.get('last_name')
            phone = request.data.get('phone')
            unit_id = request.data.get('unit_id')
            
            # Validate required fields
            if not all([email, first_name, last_name, phone, unit_id]):
                return Response({
                    'error': 'Email, first_name, last_name, phone, and unit_id are required'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Find or create user
            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    'first_name': first_name,
                    'last_name': last_name,
                    'phone': phone,
                }
            )
            
            # Update user info if not created (in case landlord wants to update existing user)
            if not created:
                user.first_name = first_name
                user.last_name = last_name
                user.phone = phone
                user.save()
            
            # Find the unit
            try:
                unit = Unit.objects.get(
                    unit_id=unit_id,
                    property__landlord=request.user
                )
            except Unit.DoesNotExist:
                return Response({
                    'error': f'Unit {unit_id} not found or not owned by you'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Check if unit is already occupied
            if Tenant.objects.filter(unit=unit).exists():
                return Response({
                    'error': f'Unit {unit_id} is already occupied'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Create tenant data
            tenant_data = {
                'user': user.id,
                'unit_id': unit.id,  # Use unit_id instead of unit
                'first_name': first_name,
                'last_name': last_name,
                'email': email,
                'phone': phone,
                'lease_type': request.data.get('lease_type', 'rental'),
                'start_date': request.data.get('start_date'),
                'end_date': request.data.get('end_date'),
                'emergency_contact_name': request.data.get('emergency_contact_name', ''),
                'emergency_contact_phone': request.data.get('emergency_contact_phone', ''),
                'emergency_contact_relationship': request.data.get('emergency_contact_relationship', ''),
            }
            
            # Validate required dates
            if not tenant_data['start_date']:
                return Response({
                    'error': 'Start date is required'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Create tenant
            serializer = self.get_serializer(data=tenant_data)
            if not serializer.is_valid():
                return Response({
                    'error': 'Invalid data provided',
                    'details': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)
            tenant = serializer.save()
            
            # Update unit status to occupied
            unit.status = 'occupied'
            unit.save()
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

class PaymentViewSet(viewsets.ModelViewSet):
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Only show payments for units owned by the requesting user
        return Payment.objects.filter(unit__property__landlord=self.request.user)

class NoticeViewSet(viewsets.ModelViewSet):
    queryset = Notice.objects.all().order_by('-date_sent')
    serializer_class = NoticeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except Exception as e:
            import traceback
            print("Notice creation error:", e)
            traceback.print_exc()
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class LandlordMaintenanceViewSet(viewsets.ModelViewSet):
    serializer_class = LandlordMaintenanceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # Landlords see maintenance for their properties
        if user.roles.filter(name='landlord').exists():
            return LandlordMaintenance.objects.filter(property__landlord=user)
        # Tenants see their own maintenance requests
        elif user.roles.filter(name='tenant').exists():
            return LandlordMaintenance.objects.filter(tenant__user=user)
        # Default to empty queryset for other roles
        return LandlordMaintenance.objects.none()

    def perform_create(self, serializer):
        user = self.request.user
        # If tenant is creating, set them as the tenant
        if user.roles.filter(name='tenant').exists():
            tenant = Tenant.objects.filter(user=user).first()
            if tenant:
                serializer.save(tenant=tenant, requested_by=user)
            else:
                raise serializers.ValidationError("Tenant profile not found")
        else:
            serializer.save(requested_by=user)

    def perform_update(self, serializer):
        user = self.request.user
        instance = self.get_object()
        
        # Only landlords can update status and assignment
        if user.roles.filter(name='landlord').exists():
            # Check if assignment is happening (either assigned_to or assignee_name/phone)
            is_assigning = (
                serializer.validated_data.get('assigned_to') or
                serializer.validated_data.get('assignee_name') or
                serializer.validated_data.get('assignee_phone')
            )
            
            # Auto-update status based on assignment
            if is_assigning and instance.status == 'pending':
                serializer.validated_data['status'] = 'in_progress'
            
            # Auto-set completed_date when status changes to completed
            if serializer.validated_data.get('status') == 'completed' and instance.status != 'completed':
                serializer.validated_data['completed_date'] = timezone.now().date()
        
        serializer.save()

class MaintenanceMessageViewSet(viewsets.ModelViewSet):
    serializer_class = MaintenanceMessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Only show maintenance messages for properties owned by the requesting user
        return MaintenanceMessage.objects.filter(maintenance__property__landlord=self.request.user)

class ChatMessageViewSet(viewsets.ModelViewSet):
    serializer_class = ChatMessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Only show chat messages where the user is the sender or recipient
        return ChatMessage.objects.filter(
            models.Q(sender=self.request.user) | models.Q(recipient=self.request.user)
        )

class LandlordPropertyUnitsView(ListAPIView):
    """
    View to get all units for a specific landlord property
    """
    serializer_class = UnitSerializer
    permission_classes = [IsLandlord]

    def get_queryset(self):
        property_id = self.kwargs.get('property_id')
        return Unit.objects.filter(property_id=property_id, property__landlord=self.request.user)

class TenantInvitationViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing tenant invitations
    """
    serializer_class = TenantInvitationSerializer
    permission_classes = [IsLandlord]

    def get_queryset(self):
        return TenantInvitation.objects.filter(landlord=self.request.user)

    def perform_create(self, serializer):
        invitation = serializer.save()
        # Here you would send the invitation email/SMS
        # For now, we'll just save the invitation
        return invitation

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def create_tenant_invitation(request):
    """
    Create a tenant invitation
    """
    try:
        # Extract unit information from the request
        unit_number = request.data.get('unitNumber')
        property_id = request.data.get('propertyId')
        
        if not unit_number or not property_id:
            return Response({
                'error': 'Unit number and property ID are required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Find the unit
        try:
            unit = Unit.objects.get(
                unit_id=unit_number,
                property_id=property_id,
                property__landlord=request.user
            )
        except Unit.DoesNotExist:
            return Response({
                'error': 'Unit not found or you do not have permission to assign it'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Check if unit is already occupied
        if hasattr(unit, 'tenant') and unit.tenant:
            return Response({
                'error': 'This unit is already occupied'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Create invitation data
        invitation_data = {
            'unit': unit.id,
            'email': request.data.get('email'),
            'phone': request.data.get('phone', ''),
            'message': request.data.get('message', ''),
        }
        
        serializer = TenantInvitationSerializer(data=invitation_data, context={'request': request})
        if serializer.is_valid():
            invitation = serializer.save()
            
            # Send invitation email
            email_sent = send_tenant_invitation_email(invitation)
            
            return Response({
                'message': 'Invitation sent successfully' + (' (email sent)' if email_sent else ' (email failed)'),
                'invitation': serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def accept_invitation(request, invitation_code):
    """
    Accept a tenant invitation - can be used for both account creation and quick approval
    """
    try:
        invitation = TenantInvitation.objects.get(
            invitation_code=invitation_code,
            status='pending'
        )
        
        if invitation.is_expired():
            invitation.status = 'expired'
            invitation.save()
            return Response({'error': 'Invitation has expired'}, status=status.HTTP_400_BAD_REQUEST)
        
        action = request.data.get('action', 'approve')  # 'approve' or 'create_account'
        
        if action == 'approve':
            # Quick approval - create tenant record without user account
            tenant_data = {
                'unit': invitation.unit.id,
                'first_name': request.data.get('firstName', ''),
                'last_name': request.data.get('lastName', ''),
                'email': invitation.email,
                'phone': invitation.phone or request.data.get('phone', ''),
                'lease_type': 'rental',  # Default
                'start_date': request.data.get('startDate') or timezone.now().date(),
                'emergency_contact_name': request.data.get('emergencyContactName', ''),
                'emergency_contact_phone': request.data.get('emergencyContactPhone', ''),
                'emergency_contact_relationship': request.data.get('emergencyContactRelationship', ''),
            }
            
            tenant_serializer = TenantSerializer(data=tenant_data)
            if tenant_serializer.is_valid():
                tenant = tenant_serializer.save()
                
                # Update unit status to occupied
                invitation.unit.status = 'occupied'
                invitation.unit.save()
                
                invitation.status = 'accepted'
                invitation.save()
                
                return Response({
                    'message': 'Tenancy approved successfully',
                    'tenant': tenant_serializer.data
                }, status=status.HTTP_201_CREATED)
            else:
                return Response(tenant_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        elif action == 'create_account':
            # Return invitation details for account creation flow
            return Response({
                'invitation': TenantInvitationSerializer(invitation).data,
                'message': 'Proceed with account creation'
            }, status=status.HTTP_200_OK)
        
        else:
            return Response({'error': 'Invalid action'}, status=status.HTTP_400_BAD_REQUEST)
        
    except TenantInvitation.DoesNotExist:
        return Response({'error': 'Invalid invitation code'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def search_users_by_email(request):
    """
    Search for users by email for auto-suggestions in invitation form
    """
    query = request.GET.get('q', '').strip()
    
    if not query or len(query) < 2:
        return Response({'suggestions': []}, status=status.HTTP_200_OK)
    
    # Search for users by email (partial match)
    users = User.objects.filter(
        email__icontains=query
    ).values('id', 'email', 'first_name', 'last_name', 'phone')[:10]  # Limit to 10 results
    
    # Also search for existing tenants by email
    tenants = Tenant.objects.filter(
        email__icontains=query
    ).values('id', 'email', 'first_name', 'last_name', 'phone')[:10]
    
    # Combine and deduplicate results
    all_results = []
    seen_emails = set()
    
    for user in users:
        if user['email'] not in seen_emails:
            all_results.append({
                'id': user['id'],
                'email': user['email'],
                'first_name': user['first_name'],
                'last_name': user['last_name'],
                'phone': user['phone'],
                'type': 'user'
            })
            seen_emails.add(user['email'])
    
    for tenant in tenants:
        if tenant['email'] not in seen_emails:
            all_results.append({
                'id': tenant['id'],
                'email': tenant['email'],
                'first_name': tenant['first_name'],
                'last_name': tenant['last_name'],
                'phone': tenant['phone'],
                'type': 'tenant'
            })
            seen_emails.add(tenant['email'])
    
    return Response({'suggestions': all_results}, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def check_user_by_email(request):
    """
    Check if a user exists by email. Returns user info if found, else exists: false.
    """
    email = request.GET.get('email', '').strip().lower()
    if not email:
        return Response({'error': 'Email is required.'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        user = User.objects.filter(email__iexact=email).first()
        if user:
            return Response({
                'exists': True,
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'phone': user.phone,
                }
            }, status=status.HTTP_200_OK)
        else:
            return Response({'exists': False}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def tenant_rentals(request):
    """
    Get rental properties for the authenticated tenant
    """
    try:
        # Get the authenticated user
        user = request.user
        
        # Check if user is a tenant
        if not user.has_role('tenant'):
            return Response({
                'error': 'Access denied. Only tenants can view their rentals.'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Get all tenancies for this user
        tenancies = Tenant.objects.filter(user=user).select_related(
            'unit__property'
        )
        
        rentals = []
        for tenancy in tenancies:
            unit = tenancy.unit
            property_obj = unit.property
            
            rental_data = {
                'id': tenancy.id,
                'property_id': property_obj.id,
                'property_name': property_obj.name,
                'property_type': property_obj.type,
                'address': f"{property_obj.street}, {property_obj.city}, {property_obj.state} {property_obj.zip_code}",
                'unit_id': unit.unit_id,
                'unit_number': unit.unit_id,
                'floor': unit.floor,
                'bedrooms': unit.bedrooms,
                'bathrooms': unit.bathrooms,
                'size': float(unit.size) if unit.size else None,
                'monthly_rent': float(unit.rent_amount),
                'security_deposit': float(unit.security_deposit) if unit.security_deposit else None,
                'lease_start_date': tenancy.start_date.isoformat(),
                'lease_end_date': tenancy.end_date.isoformat() if tenancy.end_date else None,
                'lease_type': tenancy.lease_type,
                'status': unit.status,
                'landlord_name': f"{property_obj.landlord.first_name} {property_obj.landlord.last_name}",
                'landlord_email': property_obj.landlord.email,
                'landlord_phone': property_obj.landlord.phone,
                'emergency_contact_name': tenancy.emergency_contact_name,
                'emergency_contact_phone': tenancy.emergency_contact_phone,
                'emergency_contact_relationship': tenancy.emergency_contact_relationship,
                'created_at': tenancy.created_at.isoformat(),
                'updated_at': tenancy.updated_at.isoformat()
            }
            rentals.append(rental_data)
        
        return Response({
            'rentals': rentals,
            'count': len(rentals)
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        print(f"Error fetching tenant rentals: {e}")
        return Response({
            'error': 'Failed to fetch rental properties'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def tenant_maintenance_requests(request):
    """
    Get maintenance requests for the current tenant
    """
    try:
        tenant = Tenant.objects.get(user=request.user)
        maintenance_requests = LandlordMaintenance.objects.filter(tenant=tenant).order_by('-created_at')
        
        serializer = LandlordMaintenanceSerializer(maintenance_requests, many=True, context={'request': request})
        return Response(serializer.data)
    except Tenant.DoesNotExist:
        return Response({'error': 'Tenant profile not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def create_tenant_maintenance_request(request):
    """
    Create a new maintenance request as a tenant
    """
    try:
        tenant = Tenant.objects.get(user=request.user)
        
        # Add tenant and property info to request data
        request_data = request.data.copy()
        request_data['tenant'] = tenant.id
        request_data['property'] = tenant.unit.property.id
        request_data['unit'] = tenant.unit.id
        request_data['requested_by'] = request.user.id
        
        serializer = LandlordMaintenanceSerializer(data=request_data, context={'request': request})
        if serializer.is_valid():
            maintenance_request = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Tenant.DoesNotExist:
        return Response({'error': 'Tenant profile not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def landlord_maintenance_requests(request):
    """
    Get maintenance requests for properties owned by the current landlord
    """
    try:
        maintenance_requests = LandlordMaintenance.objects.filter(
            property__landlord=request.user
        ).order_by('-created_at')
        
        serializer = LandlordMaintenanceSerializer(maintenance_requests, many=True, context={'request': request})
        return Response(serializer.data)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
