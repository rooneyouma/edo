from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
    TokenBlacklistView,
)
from rest_framework.routers import DefaultRouter
from .views import UserListView, UserDetailView, UserRegistrationView, UserLoginView, UserProfileView, LandlordPropertyListCreateView, LandlordPropertyDetailView, LandlordPropertyUnitsView, become_landlord, become_tenant, become_host, OnboardRoleView, relinquish_role, UnitViewSet, TenantViewSet, TenantInvitationViewSet, LandlordMaintenanceViewSet, NoticeViewSet, ChatMessageViewSet, create_tenant_invitation, accept_invitation, search_users_by_email, tenant_rentals, check_user_by_email, tenant_maintenance_requests, create_tenant_maintenance_request, landlord_maintenance_requests, LandlordListView, LandlordDetailView

# API v1 Router configuration
v1_router = DefaultRouter()
v1_router.register(r'units', UnitViewSet, basename='v1_unit')
v1_router.register(r'tenants', TenantViewSet, basename='v1_tenant')
v1_router.register(r'tenant-invitations', TenantInvitationViewSet, basename='v1_tenant-invitation')
v1_router.register(r'landlord-maintenance', LandlordMaintenanceViewSet, basename='v1_landlord-maintenance')
v1_router.register(r'notices', NoticeViewSet, basename='v1_notice')
v1_router.register(r'chat-messages', ChatMessageViewSet, basename='v1_chat-message')

# API v1 URL patterns
v1_urlpatterns = [
    # JWT Token endpoints
    path('token/', TokenObtainPairView.as_view(), name='v1_token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='v1_token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='v1_token_verify'),
    path('token/blacklist/', TokenBlacklistView.as_view(), name='v1_token_blacklist'),
    
    # Custom authentication endpoints
    path('users/', UserListView.as_view(), name='v1_user-list'),
    path('users/me/', UserProfileView.as_view(), name='v1_user-profile'),
    path('users/<int:pk>/', UserDetailView.as_view(), name='v1_user-detail'),
    path('auth/register/', UserRegistrationView.as_view(), name='v1_user-register'),
    path('auth/login/', UserLoginView.as_view(), name='v1_user-login'),
    path('landlord/properties/', LandlordPropertyListCreateView.as_view(), name='v1_landlord-property-list-create'),
    path('landlord/properties/<int:id>/', LandlordPropertyDetailView.as_view(), name='v1_landlord-property-detail'),
    path('landlord/properties/<int:property_id>/units/', LandlordPropertyUnitsView.as_view(), name='v1_landlord-property-units'),
    path('landlords/', LandlordListView.as_view(), name='v1_landlord-list'),
    path('landlords/<int:id>/', LandlordDetailView.as_view(), name='v1_landlord-detail'),
    path('users/become_landlord/', become_landlord, name='v1_become_landlord'),
    path('users/become_tenant/', become_tenant, name='v1_become_tenant'),
    path('users/become_host/', become_host, name='v1_become_host'),
    path('onboard-role/', OnboardRoleView.as_view(), name='v1_onboard-role'),
    path('relinquish-role/', relinquish_role, name='v1_relinquish-role'),
    
    # Tenant invitation endpoints
    path('tenants/invite/', create_tenant_invitation, name='v1_create-tenant-invitation'),
    path('tenants/accept-invitation/<str:invitation_code>/', accept_invitation, name='v1_accept-invitation'),
    path('users/search-email/', search_users_by_email, name='v1_search-users-by-email'),
    
    # Tenant rental properties endpoint
    path('tenant/rentals/', tenant_rentals, name='v1_tenant-rentals'),
    # Check user by email endpoint
    path('users/check-email/', check_user_by_email, name='v1_check-user-by-email'),
    
    # Maintenance endpoints
    path('tenant/maintenance/', tenant_maintenance_requests, name='v1_tenant-maintenance-requests'),
    path('tenant/maintenance/create/', create_tenant_maintenance_request, name='v1_create-tenant-maintenance-request'),
    path('landlord/maintenance/', landlord_maintenance_requests, name='v1_landlord-maintenance-requests'),
] + v1_router.urls

# Main URL patterns with versioning structure
urlpatterns = [
    # Versioned API endpoints
    path('v1/', include(v1_urlpatterns)),
]