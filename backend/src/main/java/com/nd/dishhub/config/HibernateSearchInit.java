package com.nd.dishhub.config;
import org.hibernate.search.mapper.orm.Search;
import org.hibernate.search.mapper.orm.session.SearchSession;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@Component
public class HibernateSearchInit implements ApplicationRunner {
    
    @PersistenceContext
    private EntityManager entityManager;
    
    @Override
    @Transactional
    public void run(ApplicationArguments args) throws Exception {
        System.out.println("Bắt đầu đồng bộ Index cho Hibernate Search...");
        SearchSession searchSession = Search.session(entityManager);
        
        // startAndWait() sẽ block luồng chính cho đến khi index xong toàn bộ DB
        searchSession.massIndexer().startAndWait();
        
        System.out.println("Đồng bộ Index hoàn tất!");
    }
}
