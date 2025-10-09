from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, Role, LandlordProperty, Unit, Tenant, Payment, Notice, LandlordMaintenance, MaintenanceMessage, ChatMessage, TenantInvitation, VacateRequest
import re
from django.utils import timezone

class UserSerializer(serializers.ModelSerializer):
    roles = serializers.SlugRelatedField(many=True, read_only=True, slug_field='name')
    profile_image = serializers.ImageField(required=False, allow_null=True, write_only=True)
    profile_image_url = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'email', 'first_name', 'last_name', 'phone', 'roles',
            'user_type', 'company_name', 'status', 'verification_status',
            'profile_image', 'profile_image_url', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_profile_image_url(self, obj):
        request = self.context.get('request')
        if obj.profile_image:
            url = obj.profile_image.url
            if request is not None:
                return request.build_absolute_uri(url)
            return url
        return None

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = [
            'email', 'first_name', 'last_name', 'phone', 'password', 'user_type', 'company_name'
        ]

    def create(self, validated_data):
        try:
            password = validated_data.pop('password')
            user = User(**validated_data)
            user.set_password(password)
            user.save()  # Save first so user has an id
            # Only assign the 'regular' role at registration
            role, _ = Role.objects.get_or_create(name='regular')
            user.roles.set([role])  # Ensure only 'regular' is assigned
            return user
        except Exception as e:
            print(f"User creation error: {e}")
            raise e

class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        if email and password:
            user = authenticate(email=email, password=password)
            if not user:
                raise serializers.ValidationError('Invalid email or password')
            if not user.is_active:
                raise serializers.ValidationError('User account is disabled')
            attrs['user'] = user
        else:
            raise serializers.ValidationError('Must include email and password')

        return attrs

class UnitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Unit
        fields = ['id', 'property', 'unit_id', 'floor', 'bedrooms', 'bathrooms', 'size', 'rent_amount', 'security_deposit', 'status', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Make unit_id read-only for updates
        if self.instance is not None:  # This is an update
            self.fields['unit_id'].read_only = True
    
    def create(self, validated_data):
        # For creation, unit_id is required and allowed
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        # For updates, remove unit_id from validated_data since it shouldn't be changed
        validated_data.pop('unit_id', None)
        return super().update(instance, validated_data)

class LandlordPropertySerializer(serializers.ModelSerializer):
    units = UnitSerializer(many=True, read_only=True)
    total_units = serializers.SerializerMethodField()

    class Meta:
        model = LandlordProperty
        fields = '__all__'
        read_only_fields = ['landlord']

    def get_total_units(self, obj):
        return obj.units.count()

class TenantSerializer(serializers.ModelSerializer):
    unit = UnitSerializer(read_only=True)
    unit_id = serializers.PrimaryKeyRelatedField(queryset=Unit.objects.all(), source='unit', write_only=True)
    
    # Computed fields for frontend compatibility
    name = serializers.SerializerMethodField()
    property = serializers.SerializerMethodField()
    unit_number = serializers.SerializerMethodField()
    rent = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()
    agreementType = serializers.CharField(source='lease_type', read_only=True)
    leaseStart = serializers.DateField(source='start_date', read_only=True)
    emergencyContact = serializers.SerializerMethodField()

    class Meta:
        model = Tenant
        fields = [
            'id', 'user', 'unit', 'unit_id', 'first_name', 'last_name', 'email', 'phone',
            'lease_type', 'start_date', 'end_date', 'emergency_contact_name',
            'emergency_contact_phone', 'emergency_contact_relationship',
            'created_at', 'updated_at',
            # Computed fields for frontend
            'name', 'property', 'unit_number', 'rent', 'status', 'agreementType', 'leaseStart', 'emergencyContact'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"

    def get_property(self, obj):
        return obj.unit.property.name if obj.unit and obj.unit.property else "N/A"

    def get_unit_number(self, obj):
        return obj.unit.unit_id if obj.unit else "N/A"

    def get_rent(self, obj):
        return float(obj.unit.rent_amount) if obj.unit and obj.unit.rent_amount else 0

    def get_status(self, obj):
        # You can implement custom status logic here
        # For now, we'll use a simple logic based on end_date
        if obj.end_date and obj.end_date < timezone.now().date():
            return 'Inactive'
        elif obj.start_date and obj.start_date > timezone.now().date():
            return 'Pending'
        else:
            return 'Active'

    def get_emergencyContact(self, obj):
        if obj.emergency_contact_name and obj.emergency_contact_phone:
            return f"{obj.emergency_contact_name} ({obj.emergency_contact_phone})"
        elif obj.emergency_contact_name:
            return obj.emergency_contact_name
        elif obj.emergency_contact_phone:
            return obj.emergency_contact_phone
        else:
            return "N/A"

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'

class NoticeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notice
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at', 'date_sent']

class MaintenanceMessageSerializer(serializers.ModelSerializer):
    sender_email = serializers.EmailField(source='sender.email', read_only=True)
    class Meta:
        model = MaintenanceMessage
        fields = '__all__'

class LandlordMaintenanceSerializer(serializers.ModelSerializer):
    messages = MaintenanceMessageSerializer(many=True, read_only=True)
    property_name = serializers.CharField(source='property.name', read_only=True)
    unit_number = serializers.CharField(source='unit.unit_id', read_only=True)
    tenant_name = serializers.SerializerMethodField()
    requested_by_name = serializers.SerializerMethodField()
    assigned_to_name = serializers.SerializerMethodField()
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    priority_display = serializers.CharField(source='get_priority_display', read_only=True)
    days_since_created = serializers.SerializerMethodField()
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = LandlordMaintenance
        fields = [
            'id', 'property', 'property_name', 'unit', 'unit_number', 'tenant', 'tenant_name',
            'subject', 'description', 'image', 'image_url', 'status', 'status_display',
            'priority', 'priority_display', 'requested_by', 'requested_by_name',
            'assigned_to', 'assigned_to_name', 'assignee_name', 'assignee_phone',
            'scheduled_date', 'completed_date', 'created_at', 'updated_at',
            'messages', 'days_since_created'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'property_name', 'unit_number', 'tenant_name', 'requested_by_name', 'assigned_to_name', 'status_display', 'priority_display', 'days_since_created', 'image_url']

    def get_tenant_name(self, obj):
        if obj.tenant:
            return f"{obj.tenant.first_name} {obj.tenant.last_name}"
        return None

    def get_requested_by_name(self, obj):
        if obj.requested_by:
            return f"{obj.requested_by.first_name} {obj.requested_by.last_name}"
        return None

    def get_assigned_to_name(self, obj):
        if obj.assigned_to:
            return f"{obj.assigned_to.first_name} {obj.assigned_to.last_name}"
        return obj.assignee_name

    def get_days_since_created(self, obj):
        from django.utils import timezone
        delta = timezone.now() - obj.created_at
        return delta.days

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return None

    def validate_assignee_phone(self, value):
        if value:
            # Basic phone validation: must be 7-20 digits, can include +, -, spaces
            phone_pattern = re.compile(r'^[\d\+\-\s]{7,20}$')
            if not phone_pattern.match(value):
                raise serializers.ValidationError('Enter a valid phone number (7-20 digits, may include +, - or spaces).')
        return value

    def update(self, instance, validated_data):
        assigned_to = validated_data.get('assigned_to', None)
        assignee_name = validated_data.get('assignee_name', None)
        assignee_phone = validated_data.get('assignee_phone', None)
        # Validate phone number if provided
        if assignee_phone is not None:
            self.validate_assignee_phone(assignee_phone)
        # Only set status to in_progress if assignment is happening and was previously unassigned
        is_assigning = (
            (assigned_to is not None and assigned_to != instance.assigned_to) or
            (assignee_name is not None and assignee_name != instance.assignee_name) or
            (assignee_phone is not None and assignee_phone != instance.assignee_phone)
        )
        if is_assigning and instance.status == 'pending':
            validated_data['status'] = 'in_progress'
        # Prevent assignment if completed/cancelled
        if instance.status in ['completed', 'cancelled'] and is_assigning:
            raise serializers.ValidationError('Cannot assign a completed or cancelled maintenance request.')
        return super().update(instance, validated_data)

class ChatMessageSerializer(serializers.ModelSerializer):
    sender_email = serializers.EmailField(source='sender.email', read_only=True)
    recipient_email = serializers.EmailField(source='recipient.email', read_only=True)
    class Meta:
        model = ChatMessage
        fields = '__all__'
        read_only_fields = ['sender']

class TenantInvitationSerializer(serializers.ModelSerializer):
    landlord_name = serializers.CharField(source='landlord.get_full_name', read_only=True)
    property_name = serializers.CharField(source='unit.property.name', read_only=True)
    unit_id = serializers.CharField(source='unit.unit_id', read_only=True)
    invitation_url = serializers.SerializerMethodField()
    
    class Meta:
        model = TenantInvitation
        fields = [
            'id', 'landlord', 'landlord_name', 'unit', 'property_name', 'unit_id',
            'email', 'phone', 'invitation_code', 'message', 'status', 'expires_at',
            'created_at', 'updated_at', 'invitation_url'
        ]
        read_only_fields = ['id', 'landlord', 'invitation_code', 'status', 'created_at', 'updated_at']
    
    def get_invitation_url(self, obj):
        # This would be the frontend URL where tenants can accept invitations
        return f"/accept-invitation/{obj.invitation_code}"
    
    def create(self, validated_data):
        # Set the landlord to the current user
        validated_data['landlord'] = self.context['request'].user
        return super().create(validated_data)

class LandlordListSerializer(serializers.ModelSerializer):
    """
    Serializer for landlord list view that includes landlord details and property count
    """
    property_count = serializers.SerializerMethodField()
    full_name = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'full_name', 'property_count']
    
    def get_property_count(self, obj):
        return obj.landlord_properties.count()
    
    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}".strip()

class LandlordDetailSerializer(serializers.ModelSerializer):
    """
    Serializer for landlord detail view that includes properties
    """
    properties = LandlordPropertySerializer(source='landlord_properties', many=True, read_only=True)
    full_name = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'full_name', 'properties']
    
    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}".strip()


class VacateRequestSerializer(serializers.ModelSerializer):
    tenant_name = serializers.SerializerMethodField()
    property_name = serializers.CharField(source='property.name', read_only=True)
    unit_number = serializers.CharField(source='unit.unit_id', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = VacateRequest
        fields = [
            'id', 'tenant', 'unit', 'property', 'move_out_date', 'reason', 
            'status', 'status_display', 'landlord_response', 'response_date',
            'created_at', 'updated_at', 'tenant_name', 'property_name', 'unit_number'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'status', 'tenant_name', 'property_name', 'unit_number', 'status_display', 'tenant', 'unit', 'property']
    
    def get_tenant_name(self, obj):
        return f"{obj.tenant.first_name} {obj.tenant.last_name}"
    
    def create(self, validated_data):
        # Get the request from the serializer context
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            # Get the tenant from the authenticated user
            try:
                tenant = Tenant.objects.get(user=request.user)
                validated_data['tenant'] = tenant
                validated_data['unit'] = tenant.unit
                validated_data['property'] = tenant.unit.property
            except Tenant.DoesNotExist:
                raise serializers.ValidationError("Tenant profile not found")
        else:
            raise serializers.ValidationError("User authentication required")
        
        return super().create(validated_data)
