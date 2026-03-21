package com.nd.dishhub.repository;

import com.nd.dishhub.model.RoleEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<RoleEntity, Long> {

    /**
     * Tìm role theo name
     */
    Optional<RoleEntity> findByName(String name);

    /**
     * Kiểm tra role đã tồn tại chưa
     */
    boolean existsByName(String name);

    /**
     * Tìm role với tất cả users (sử dụng JOIN FETCH)
     */
    @Query("SELECT DISTINCT r FROM RoleEntity r " +
           "LEFT JOIN FETCH r.users " +
           "WHERE r.id = :id")
    Optional<RoleEntity> findByIdWithUsers(@Param("id") Long id);

    /**
     * Tìm role với tất cả users theo role name
     */
    @Query("SELECT DISTINCT r FROM RoleEntity r " +
           "LEFT JOIN FETCH r.users " +
           "WHERE r.name = :name")
    Optional<RoleEntity> findByNameWithUsers(@Param("name") String name);
}

