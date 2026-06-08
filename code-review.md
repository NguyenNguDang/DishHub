# DishHub Code Review (Clean Code + Hieu nang)

Ngay: 2026-05-17

## Pham vi da xem

Backend:
- `backend/src/main/java/com/nd/dishhub/controller/RecipeController.java`
- `backend/src/main/java/com/nd/dishhub/service/impl/RecipeServiceImpl.java`
- `backend/src/main/java/com/nd/dishhub/repository/RecipeRepository.java`
- `backend/src/main/java/com/nd/dishhub/controller/AuthController.java`
- `backend/src/main/java/com/nd/dishhub/service/impl/AuthServiceImpl.java`
- `backend/src/main/java/com/nd/dishhub/security/SecurityConfig.java`
- `backend/src/main/java/com/nd/dishhub/security/JwtFilter.java`

Frontend:
- `frontend/src/services/api.ts`
- `frontend/src/services/recipeService.ts`
- `frontend/src/store/AuthProvider.tsx`
- `frontend/src/store/useAuthStore.ts`

## Findings (uu tien cao -> thap)

### 1) Filter in-memory lam sai phan trang va ton RAM
- File: `backend/src/main/java/com/nd/dishhub/service/impl/RecipeServiceImpl.java` (lines 285-327)
- Van de:
  - `filterRecipes` lay `Page` tu DB roi filter trong bo nho.
  - `totalElements` bi sai; RAM va CPU tang khi data lon.
- De xuat:
  - Day filter xuong DB (Specification/Criteria/Query linh dong).
  - Neu can filter client-side, tra `List` khong phan trang hoac truyen paging sau khi filter tren DB.

### 2) Update ingredients co the gay N+1 inserts
- File: `backend/src/main/java/com/nd/dishhub/service/impl/RecipeServiceImpl.java` (lines 194-224)
- Van de:
  - `deleteByRecipeId` + `save` tung item trong vong lap.
- De xuat:
  - Tao list `RecipeIngredientEntity` va `saveAll`.
  - Can nhac batch insert (hibernate.jdbc.batch_size) neu so luong lon.

### 3) Lap lai try/catch fallback Pageable
- File: `backend/src/main/java/com/nd/dishhub/controller/RecipeController.java` (lines 86-118, 121-133, 165-176, 214-224, 233-243)
- Van de:
  - Lap lai khoi try/catch de tao `PageRequest` thay the.
  - Che dau loi that; kho bao tri.
- De xuat:
  - Dung `@PageableDefault` va/hoac global exception handler cho `MethodArgumentTypeMismatchException`.
  - Tao helper chung de tai su dung.

### 4) Controller qua nhieu logic: parse userId, "me"
- File: `backend/src/main/java/com/nd/dishhub/controller/RecipeController.java` (lines 88-104)
- Van de:
  - Logic `userId=me` va parse Long nam trong controller.
- De xuat:
  - Tach endpoint ro rang (`/me/recipes`) hoac dua vao service/helper.

### 5) Lap lai lay user tu Principal
- File: `backend/src/main/java/com/nd/dishhub/controller/RecipeController.java` (lines 44-47, 195-203, 211-213, 252-256)
- Van de:
  - Lap lai `userRepository.findByEmail(principal.getName())`.
- De xuat:
  - Tao `AuthenticatedUserService` hoac util de lay `UserEntity`.

### 6) Public endpoints bi hardcode o 2 noi
- File: `backend/src/main/java/com/nd/dishhub/security/JwtFilter.java` (lines 34-99)
- Lien quan: `backend/src/main/java/com/nd/dishhub/security/SecurityConfig.java` (lines 35-46)
- Van de:
  - Danh sach public endpoints hardcode trong filter va config.
  - De lech khi thay doi.
- De xuat:
  - Gom ve 1 noi (matcher chung) hoac tao bean danh sach public endpoints.

### 7) Log bang System.err trong filter
- File: `backend/src/main/java/com/nd/dishhub/security/JwtFilter.java` (lines 74-76)
- Van de:
  - Dung `System.err.println` thay vi logger.
- De xuat:
  - Dung `Logger` (SLF4J) va log level phu hop.

### 8) Cong thuc tinh protein khong ro rang
- File: `backend/src/main/java/com/nd/dishhub/service/impl/RecipeServiceImpl.java` (lines 232-257)
- Van de:
  - Protein tinh theo cong thuc uoc luong; de sai logic.
- De xuat:
  - Neu co field protein, dung field do.
  - Neu chua co, tach nutrition service va ghi ro trong comment/doc.

### 9) Tags luu chuoi + LIKE query
- File: `backend/src/main/java/com/nd/dishhub/repository/RecipeRepository.java` (lines 85-87)
- Van de:
  - LIKE tren chuoi tags khong scale, kho index.
- De xuat:
  - Normalize tags (bang Tag + join) de truy van hieu qua.

### 10) Frontend services lap code xu ly loi
- File: `frontend/src/services/recipeService.ts` (lines 28-227)
- Van de:
  - Moi method lap `try/catch` + `console.error`.
- De xuat:
  - Trung tam hoa error handling trong `api.ts` hoac wrapper chung.

### 11) Redirect 401 trong interceptor
- File: `frontend/src/services/api.ts` (lines 33-38)
- Van de:
  - `window.location.href` gay giat UX; co the loop neu public endpoint tra 401.
- De xuat:
  - Phat su kien / callback tu app, dung router de dieu huong.

### 12) URL endpoint hardcode nhieu noi
- File: `frontend/src/services/recipeService.ts` (lines 28-203)
- Van de:
  - Chuoi endpoint lap lai, de sai khi thay doi.
- De xuat:
  - Tao const endpoint hoac helper builder.

### 13) Restore user moi lan load app
- File: `frontend/src/store/AuthProvider.tsx` (lines 12-31)
- Van de:
  - Moi lan load app se goi API; token het han gay request thua.
- De xuat:
  - Cache user o localStorage hoac dung React Query de co staleTime.

## Han che / can xem tiep
- Chua review cac service/impl khac o backend va cac page/components o frontend.
- Neu can review toan bo, nen doc them `frontend/src/pages`, `frontend/src/components`, `backend/src/main/java/.../service/impl` khac.

## De xuat tiep theo
1) Xac nhan muon refactor theo huong DB-side filtering va batch insert.
2) Chon muc tieu tiep theo: backend truoc hay frontend truoc.

