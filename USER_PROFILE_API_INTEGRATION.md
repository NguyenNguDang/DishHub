# User Profile Page - API Integration Complete ✅

## 📋 Tóm tắt

Đã tích hợp đầy đủ API cho UserProfilePage với:
- ✅ Lấy profile hiện tại
- ✅ Cập nhật thông tin profile
- ✅ Upload avatar
- ✅ Error/Loading states
- ✅ React Query caching

---

## 🆕 Files Tạo Mới

### **1. userProfileService.ts** (Frontend Service)
```typescript
// Lấy profile hiện tại
getCurrentProfile() → GET /v1/users/me

// Cập nhật profile
updateProfile(data) → PUT /v1/users/me

// Upload avatar
uploadAvatar(file) → POST /v1/users/avatar
```

### **2. useUserProfile.ts** (Frontend Hooks)
```typescript
// Fetch profile
const { data: currentProfile, isLoading, error } = useCurrentProfile()

// Update profile
const updateProfileMutation = useUpdateProfile()
await updateProfileMutation.mutateAsync({
  firstName, lastName, email, age, weight, bio, preferences
})

// Upload avatar
const uploadAvatarMutation = useUploadAvatar()
const newAvatarUrl = await uploadAvatarMutation.mutateAsync(file)
```

---

## 🔧 Files Sửa Đổi

### **1. UserProfilePage.tsx** - Major Updates

#### **API Integration**
```typescript
// ✅ API hooks
const { data: currentProfile, isLoading, error } = useCurrentProfile();
const updateProfileMutation = useUpdateProfile();
const uploadAvatarMutation = useUploadAvatar();

// ✅ Initialize from API data
useEffect(() => {
  if (currentProfile) {
    setFormData({
      firstName: currentProfile.firstName || '',
      ...
    });
  }
}, [currentProfile]);
```

#### **Form Submit**
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  await updateProfileMutation.mutateAsync({
    firstName, lastName, email, age, weight, bio, preferences
  });
};
```

#### **Avatar Upload**
```typescript
const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  const newAvatarUrl = await uploadAvatarMutation.mutateAsync(file);
  setAvatarUrl(newAvatarUrl);
};
```

#### **Loading/Error States**
```typescript
// ✅ Show loading
if (isLoading) {
  return <LoadingSpinner />;
}

// ✅ Show error
if (error) {
  return <ErrorMessage error={error} />;
}
```

---

## 📊 Backend Endpoints Used

| Method | Endpoint | Chức năng |
|--------|----------|----------|
| GET | `/api/v1/users/me` | Lấy profile hiện tại |
| PUT | `/api/v1/users/me` | Cập nhật profile |
| POST | `/api/v1/users/avatar` | Upload avatar (cần implement) |

---

## 🔄 Data Flow

### **Load Profile**
```
Component Mount
    ↓
useCurrentProfile()
    ↓
API: GET /api/v1/users/me
    ↓
queryClient cache
    ↓
Form pre-fill + Display
```

### **Save Changes**
```
User Click Save
    ↓
handleSubmit()
    ↓
updateProfileMutation.mutateAsync({...})
    ↓
API: PUT /api/v1/users/me
    ↓
onSuccess: queryClient.setQueryData()
    ↓
UI Update + Alert
```

### **Upload Avatar**
```
User Select Image
    ↓
handleAvatarUpload()
    ↓
uploadAvatarMutation.mutateAsync(file)
    ↓
API: POST /api/v1/users/avatar (FormData)
    ↓
onSuccess: Update cache + Display new avatar
    ↓
Success Alert
```

---

## 🎯 Features Implemented

| Feature | Status | Implementation |
|---------|--------|-----------------|
| Load Profile | ✅ | useCurrentProfile hook |
| Pre-fill Form | ✅ | useEffect + setFormData |
| Edit Fields | ✅ | handleInputChange |
| Save Changes | ✅ | updateProfileMutation |
| Upload Avatar | ✅ | uploadAvatarMutation |
| Loading State | ✅ | isLoading spinner |
| Error State | ✅ | Error message display |
| Auto Cache | ✅ | queryClient invalidate |
| Dietary Prefs | ✅ | toggleDietaryPreference |

---

## 📝 Types Used

```typescript
interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  age?: number;
  weight?: number;
  height?: number;
  bio?: string;
  preferences?: {
    theme: 'light' | 'dark';
    language: 'en' | 'vi';
    dietaryRestrictions: string[];
  };
}

interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  age?: number;
  weight?: number;
  height?: number;
  bio?: string;
  preferences?: {...};
}
```

---

## ⚠️ Todos (Backend)

Cần implement trên backend:

1. **PUT /api/v1/users/me** - Cập nhật profile
   - Input: UpdateProfileRequest
   - Output: UserProfile

2. **POST /api/v1/users/avatar** - Upload avatar
   - Input: FormData với file
   - Output: { url: string }

3. **Extend UserResponse** - Thêm fields:
   - age, weight, height, bio, preferences

---

## ✅ Status: FRONTEND COMPLETE

- ✅ Service layer built
- ✅ Hooks implemented with React Query
- ✅ Component integrated
- ✅ Error/Loading handling
- ✅ Loading states
- ✅ Cache management

**Chỉ cần backend implement 2 endpoints là hoàn toàn đủ!**

---

## 🚀 Testing

```bash
# 1. Rebuild frontend
npm run dev

# 2. Test endpoints exist
curl http://localhost:8080/api/v1/users/me

# 3. Load profile page
# → Should auto-load current user profile
# → Form should pre-fill with data

# 4. Try save changes
# → Should send PUT request to backend
# → Should show success/error message

# 5. Try upload avatar
# → Should send FormData to backend
# → Should display new avatar
```

---

**Đã sẵn sàng! 🎉**

