from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission, BaseUserManager
from django.utils.translation import gettext_lazy as _
from django.core.exceptions import ValidationError
import logging
import secrets
from django.utils import timezone

logger = logging.getLogger(__name__)

# Role is for business logic (e.g., dashboard display, feature access)
# Django groups/permissions are for internal system access control
class Role(models.Model):
    class RoleName(models.TextChoices):
        HOST = 'host', _('host')
        TENANT = 'tenant', _('tenant')
        LANDLORD = 'landlord', _('landlord')
        ADMIN = 'admin', _('admin')
        REGULAR = 'regular', _('regular')
    # Remove choices constraint to allow dynamic roles
    name = models.CharField(max_length=20, unique=True)

    def __str__(self):
        # If using TextChoices, get label, else fallback to name
        try:
            return str(self.RoleName(self.name).label)
        except ValueError:
            return str(self.name)

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            logger.error('User creation failed: Email field must be set')
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        try:
            user = self.model(email=email, **extra_fields)
            user.set_password(password)
            user.full_clean()  # Validate model fields
            user.save(using=self._db)
            return user
        except Exception as e:
            logger.error(f'User creation failed for {email}: {e}')
            raise ValueError(f'User creation failed: {e}')

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            logger.error('Superuser creation failed: is_staff must be True')
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            logger.error('Superuser creation failed: is_superuser must be True')
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)

def validate_profile_image(image):
    # Validate file type
    valid_mime_types = ['image/jpeg', 'image/png']
    valid_extensions = ['.jpg', '.jpeg', '.png']
    import os
    ext = os.path.splitext(image.name)[1].lower()
    if ext not in valid_extensions:
        raise ValidationError('Unsupported file extension. Only .jpg and .png are allowed.')
    # Validate file size (max 2MB)
    max_size = 2 * 1024 * 1024
    if image.size > max_size:
        raise ValidationError('Image file too large (max 2MB).')

class User(AbstractUser):
    """
    Custom user model that extends Django's AbstractUser
    """
    # Override username field to use email instead
    username = None
    email = models.EmailField(_('email address'), unique=True)
    
    # Additional fields from the forms
    phone = models.CharField(max_length=20, null=True, blank=True)
    roles = models.ManyToManyField(Role, related_name='users')
    user_type = models.CharField(max_length=20, choices=[
        ('individual', 'Individual'),
        ('company', 'Company')
    ], default='individual')
    company_name = models.CharField(max_length=255, null=True, blank=True)
    status = models.CharField(max_length=20, choices=[
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('suspended', 'Suspended')
    ], default='active')
    verification_status = models.CharField(max_length=20, choices=[
        ('unverified', 'Unverified'),
        ('pending', 'Pending'),
        ('verified', 'Verified')
    ], default='unverified')
    profile_image = models.ImageField(upload_to='profile_images/', null=True, blank=True, validators=[validate_profile_image])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Use email as the username field
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    # Use custom manager
    objects = UserManager()

    groups = models.ManyToManyField(
        Group,
        related_name='edoapi_user_set',
        blank=True,
        help_text='The groups this user belongs to. Use for system access control, not business logic.',
        verbose_name='groups'
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name='edoapi_user_set_permissions',
        blank=True,
        help_text='Specific permissions for this user. Use for system access control, not business logic.',
        verbose_name='user permissions'
    )

    def clean(self):
        super().clean()
        # Prevent conflicting roles (e.g., both tenant and landlord)
        role_names = set(self.roles.values_list('name', flat=True))
        exclusive_roles = {Role.RoleName.HOST, Role.RoleName.TENANT, Role.RoleName.LANDLORD, Role.RoleName.ADMIN, Role.RoleName.REGULAR}
        # Only allow one exclusive role at a time
        if len(role_names & exclusive_roles) > 1:
            raise ValidationError('A user cannot have more than one of the following roles: host, tenant, landlord, admin, regular.')

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.email})"

    def has_role(self, role_name):
        """Check if the user has a specific role by name (string or Role.RoleName)."""
        return self.roles.filter(name=role_name).exists()

    def is_landlord(self):
        return self.has_role(Role.RoleName.LANDLORD)

    def is_tenant(self):
        return self.has_role(Role.RoleName.TENANT)

    def is_host(self):
        return self.has_role(Role.RoleName.HOST)

    def is_admin(self):
        return self.has_role(Role.RoleName.ADMIN)

    def is_regular(self):
        return self.has_role(Role.RoleName.REGULAR)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        regular_role, _ = Role.objects.get_or_create(name='regular')
        if not self.roles.filter(name='regular').exists():
            self.roles.add(regular_role)

class LandlordProperty(models.Model):
    PROPERTY_TYPES = [
        ('House', 'House'),
        ('Apartment', 'Apartment'),
        ('Villa', 'Villa'),
        ('Townhouse', 'Townhouse'),
        ('Office', 'Office'),
        ('Commercial', 'Commercial'),
        ('Other', 'Other'),
    ]
    landlord = models.ForeignKey(User, on_delete=models.CASCADE, related_name='landlord_properties')
    name = models.CharField(max_length=255)
    type = models.CharField(max_length=50, choices=PROPERTY_TYPES)
    description = models.TextField(blank=True)
    street = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    zip_code = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.city}, {self.state})"

class Unit(models.Model):
    property = models.ForeignKey(LandlordProperty, on_delete=models.CASCADE, related_name='units')
    unit_id = models.CharField(max_length=50)
    floor = models.CharField(max_length=20, blank=True)
    bedrooms = models.PositiveIntegerField(default=1)
    bathrooms = models.PositiveIntegerField(default=1)
    size = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True, help_text='Size in square meters or feet')
    rent_amount = models.DecimalField(max_digits=10, decimal_places=2)
    security_deposit = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    status = models.CharField(max_length=20, choices=[('vacant', 'Vacant'), ('occupied', 'Occupied')], default='vacant')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Unit {self.unit_id} - {self.property.name}"

class Tenant(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tenancies')
    unit = models.OneToOneField(Unit, on_delete=models.CASCADE, related_name='tenant')
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    lease_type = models.CharField(max_length=20, choices=[('rental', 'Rental'), ('lease', 'Lease')], default='rental')
    start_date = models.DateField()
    end_date = models.DateField(blank=True, null=True)
    emergency_contact_name = models.CharField(max_length=100, blank=True)
    emergency_contact_phone = models.CharField(max_length=20, blank=True)
    emergency_contact_relationship = models.CharField(max_length=50, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name} (Unit {self.unit.unit_id})"

class Payment(models.Model):
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name='payments')
    unit = models.ForeignKey(Unit, on_delete=models.CASCADE, related_name='payments')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_date = models.DateField()
    payment_method = models.CharField(max_length=50)
    reference = models.CharField(max_length=100, blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Payment {self.amount} for Unit {self.unit.unit_id} by {self.tenant.first_name}"

class Notice(models.Model):
    unit = models.ForeignKey(Unit, on_delete=models.CASCADE, related_name='notices', null=True, blank=True)
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name='notices', null=True, blank=True)
    notice_type = models.CharField(max_length=50)
    title = models.CharField(max_length=255)
    message = models.TextField()
    date_sent = models.DateTimeField(auto_now_add=True)
    effective_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Notice: {self.title} to {self.tenant.first_name if self.tenant else 'All'} (Unit {self.unit.unit_id if self.unit else 'All'})"

class LandlordMaintenance(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ]
    property = models.ForeignKey(LandlordProperty, on_delete=models.CASCADE, related_name='maintenance_requests')
    unit = models.ForeignKey(Unit, on_delete=models.CASCADE, related_name='maintenance_requests')
    tenant = models.ForeignKey(Tenant, on_delete=models.SET_NULL, null=True, blank=True, related_name='maintenance_requests')
    subject = models.CharField(max_length=255)
    description = models.TextField()
    image = models.ImageField(upload_to='maintenance_images/', null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')
    requested_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='landlord_maintenance_requested')
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='landlord_maintenance_assigned')
    assignee_name = models.CharField(max_length=255, blank=True, null=True)
    assignee_phone = models.CharField(max_length=20, blank=True, null=True)
    scheduled_date = models.DateField(null=True, blank=True)
    completed_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.subject} ({self.get_status_display()})"

class MaintenanceMessage(models.Model):
    maintenance = models.ForeignKey(LandlordMaintenance, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='maintenance_messages')
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Message by {self.sender.email} on {self.timestamp}"

class ChatMessage(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_chat_messages')
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_chat_messages')
    unit = models.ForeignKey(Unit, on_delete=models.SET_NULL, null=True, blank=True, related_name='chat_messages')
    property = models.ForeignKey(LandlordProperty, on_delete=models.SET_NULL, null=True, blank=True, related_name='chat_messages')
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f"Chat from {self.sender.email} to {self.recipient.email} at {self.timestamp}"

class TenantInvitation(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('expired', 'Expired'),
        ('cancelled', 'Cancelled'),
    ]
    
    landlord = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tenant_invitations')
    unit = models.ForeignKey(Unit, on_delete=models.CASCADE, related_name='tenant_invitations')
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True, null=True)
    invitation_code = models.CharField(max_length=100, unique=True)
    message = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    expires_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Invitation for {self.email} - {self.unit.property.name} Unit {self.unit.unit_id}"
    
    def is_expired(self):
        return timezone.now() > self.expires_at
    
    def save(self, *args, **kwargs):
        if not self.invitation_code:
            self.invitation_code = self.generate_invitation_code()
        if not self.expires_at:
            self.expires_at = timezone.now() + timezone.timedelta(days=7)  # 7 days expiry
        super().save(*args, **kwargs)
    
    def generate_invitation_code(self):
        return secrets.token_urlsafe(32)

