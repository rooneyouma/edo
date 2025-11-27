# Edo Mobile App - Identified Issues and Concerns

## Overview
This document outlines the business and development logic issues identified during the planning phase for implementing the mobile version of the Edo web application.

## Business Logic Issues

### 1. Role Management Inconsistencies
**Issue**: The web app allows users to have multiple roles simultaneously, but the backend enforces exclusive roles.
**Location**: 
- Backend: `backend/edoAPI/models.py` lines 123-130 (clean method)
- Frontend: Role switching UI in `edo/src/app/page.js`

**Description**: 
- The backend's User model [clean()](file://c:\Users\HomePC\Documents\Edo%20SaaS%20Group\edo\backend\edoAPI\models.py#L123-L130) method prevents conflicting roles (host, tenant, landlord, admin, regular)
- However, the UI seems to allow switching between roles freely without proper validation
- This inconsistency can lead to user confusion and unexpected behavior

**Recommendation**: 
- Align frontend behavior with backend constraints
- Provide clear feedback when role switching isn't allowed
- Implement proper role relinquishment flows before adding new roles

### 2. Data Model Gaps
**Issue**: Missing clear separation between different property types in the data model.
**Location**: `backend/edoAPI/models.py` lines 161-169 (PROPERTY_TYPES)

**Description**: 
- The PROPERTY_TYPES list mixes residential and commercial types without clear categorization
- Some business logic depends on property type but lacks consistency
- This makes it difficult to implement role-specific features correctly

**Recommendation**: 
- Add clearer categorization of property types (residential vs commercial)
- Implement proper validation based on property categories
- Consider separate models or model extensions for significantly different property types

### 3. Tenant Invitation Process Flaws
**Issue**: The invitation system has several edge cases that aren't handled properly.
**Location**: 
- Backend: `backend/edoAPI/views.py` (tenant invitation views)
- Frontend: Related components in `edo/src/components/landlord/`

**Description**: 
- Invitations can expire but the UI doesn't clearly indicate this
- Multiple invitations for the same unit are possible
- No mechanism to resend invitations
- No proper handling of invitation acceptance flows

**Recommendation**: 
- Add expiration indicators in the UI
- Prevent duplicate invitations for the same unit/email
- Implement invitation resend functionality
- Add better error handling for expired invitations

### 4. Vacate Request Limitations
**Issue**: The vacate request system has rigid constraints that may not fit all scenarios.
**Location**: `backend/edoAPI/views.py` lines 1000-1100 (VacateRequestViewSet)

**Description**: 
- Hard-coded 30-day minimum notice period
- Rate limiting of 3 requests per day per property
- No provision for exceptional circumstances
- No communication channel for discussing move-out dates

**Recommendation**: 
- Make notice periods configurable per property
- Allow landlords to override rate limits when necessary
- Add communication channel for exceptional requests
- Implement a negotiation flow for move-out dates

## Development Logic Issues

### 5. Mobile-Specific Concerns
**Issue**: Several features may not translate well to mobile:
1. Complex forms with many fields
2. Desktop-oriented navigation patterns
3. Heavy reliance on hover states for UI feedback
4. Image-heavy layouts that may be slow on mobile networks

**Recommendation**: 
- Simplify forms with progressive disclosure
- Implement mobile-first navigation patterns
- Add touch-friendly alternatives to hover interactions
- Implement image optimization and lazy loading

### 6. Security Considerations
**Issue**: Potential security gaps in the mobile implementation:
1. Token storage in plaintext (if using AsyncStorage)
2. Lack of biometric authentication support
3. No secure deep linking for invitation acceptance

**Recommendation**: 
- Use SecureStore for token storage instead of AsyncStorage
- Implement biometric authentication options
- Add proper validation for deep links
- Implement certificate pinning for API requests

### 7. API Integration Challenges
**Issue**: The existing API may not be optimized for mobile usage:
1. Over-fetching data for mobile screens
2. Lack of offline capabilities
3. No bandwidth optimization

**Recommendation**: 
- Create mobile-specific API endpoints that return only necessary data
- Implement caching strategies for offline access
- Add data compression for image and file transfers

### 8. Performance Concerns
**Issue**: Mobile devices have different performance characteristics:
1. Slower processors compared to desktops
2. Limited memory resources
3. Network connectivity issues

**Recommendation**: 
- Implement efficient data fetching strategies
- Add loading states and skeleton screens
- Optimize image sizes for mobile devices
- Implement pagination for large data sets

## Implementation Priority Recommendations

1. **Phase 1 (Critical)**: Authentication and core API integration
2. **Phase 2 (High)**: Marketplace browsing and property viewing
3. **Phase 3 (Medium)**: Role-specific dashboards (Landlord/Tenant)
4. **Phase 4 (Low)**: Advanced features like chat and notifications

## Additional Considerations

### User Experience
- Touch target sizes should follow mobile guidelines (minimum 48x48 pixels)
- Forms should be optimized for mobile input (appropriate keyboard types)
- Navigation should be simplified for smaller screens

### Platform-Specific Features
- Consider implementing platform-specific features (biometrics, push notifications)
- Follow platform design guidelines (Material Design for Android, Human Interface Guidelines for iOS)
- Implement deep linking for better user experience

### Testing
- Implement device-specific testing for various screen sizes
- Test on different network conditions
- Validate performance on lower-end devices