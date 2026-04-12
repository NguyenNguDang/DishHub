package com.nd.dishhub.repository;

import com.nd.dishhub.model.ShoppingListEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface ShoppingListRepository extends JpaRepository<ShoppingListEntity, Long> {
    
    /**
     * Tìm shopping list của user cho tuần cụ thể
     */
    Optional<ShoppingListEntity> findByUserIdAndWeekStart(Long userId, LocalDate weekStart);
}

