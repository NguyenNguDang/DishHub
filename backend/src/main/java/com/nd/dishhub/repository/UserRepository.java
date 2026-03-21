package com.nd.dishhub.repository;

import com.nd.dishhub.model.UserEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {
    

    Optional<UserEntity> findByEmail(String email);

    /**
     * Kiểm tra xem email đã tồn tại chưa
     */
    boolean existsByEmail(String email);

    /**
     * Tìm tất cả active users
     */
    List<UserEntity> findByIsActiveTrue();

    /**
     * Tìm tất cả inactive users
     */
    List<UserEntity> findByIsActiveFalse();

    /**
     * Tìm user theo firstName hoặc lastName (partial match)
     */
    List<UserEntity> findByFirstNameContainingOrLastNameContaining(String firstName, String lastName);

    /**
     * Tìm user theo tên đầy đủ
     */
    Optional<UserEntity> findByFirstNameAndLastName(String firstName, String lastName);

    /**
     * Tìm users với phân trang
     */
    Page<UserEntity> findByIsActiveTrue(Pageable pageable);

    /**
     * Tìm user với tất cả roles (sử dụng JOIN FETCH để tránh N+1 problem)
     */
    @Query("SELECT DISTINCT u FROM UserEntity u " +
           "LEFT JOIN FETCH u.roles " +
           "WHERE u.id = :id")
    Optional<UserEntity> findByIdWithRoles(@Param("id") Long id);

    /**
     * Tìm user với tất cả recipes
     */
    @Query("SELECT DISTINCT u FROM UserEntity u " +
           "LEFT JOIN FETCH u.recipes " +
           "WHERE u.id = :id")
    Optional<UserEntity> findByIdWithRecipes(@Param("id") Long id);

    /**
     * Tìm user với tất cả meal plans
     */
    @Query("SELECT DISTINCT u FROM UserEntity u " +
           "LEFT JOIN FETCH u.mealPlans " +
           "WHERE u.id = :id")
    Optional<UserEntity> findByIdWithMealPlans(@Param("id") Long id);

    /**
     * Tìm user với tất cả reviews
     */
    @Query("SELECT DISTINCT u FROM UserEntity u " +
           "LEFT JOIN FETCH u.reviews " +
           "WHERE u.id = :id")
    Optional<UserEntity> findByIdWithReviews(@Param("id") Long id);

    /**
     * Tìm user với tất cả relationships
     */
    @Query("SELECT DISTINCT u FROM UserEntity u " +
           "LEFT JOIN FETCH u.roles " +
           "LEFT JOIN FETCH u.recipes " +
           "LEFT JOIN FETCH u.mealPlans " +
           "LEFT JOIN FETCH u.reviews " +
           "WHERE u.id = :id")
    Optional<UserEntity> findByIdWithAllRelationships(@Param("id") Long id);

    /**
     * Tìm users có một role cụ thể (by role name)
     */
    @Query("SELECT DISTINCT u FROM UserEntity u " +
           "JOIN u.roles r " +
           "WHERE r.name = :roleName")
    List<UserEntity> findUsersByRoleName(@Param("roleName") String roleName);

    /**
     * Đếm số users với một role cụ thể
     */
    @Query("SELECT COUNT(DISTINCT u) FROM UserEntity u " +
           "JOIN u.roles r " +
           "WHERE r.name = :roleName")
    long countUsersByRoleName(@Param("roleName") String roleName);

    /**
     * Tìm users theo age range
     */
    List<UserEntity> findByAgeBetween(Integer minAge, Integer maxAge);

    /**
     * Tìm users theo weight range
     */
    List<UserEntity> findByWeightBetween(Float minWeight, Float maxWeight);

    /**
     * Tìm users theo height range
     */
    List<UserEntity> findByHeightBetween(Float minHeight, Float maxHeight);
}
