package com.naren.backend.repository;

import com.naren.backend.entity.PaymentStatus;
import com.naren.backend.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, String> {
    Optional<Transaction> findByTransactionReference(String transactionReference);
    
    List<Transaction> findByPaymentId(String paymentId);
    
    List<Transaction> findByStatus(PaymentStatus status);
    
    List<Transaction> findByGatewayName(String gatewayName);
    
    List<Transaction> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
    
    List<Transaction> findByAmountBetween(double minAmount, double maxAmount);
    
    boolean existsByTransactionReference(String transactionReference);
    
    List<Transaction> findByStatusAndGatewayName(PaymentStatus status, String gatewayName);
    
    Double sumAmountByGateway(String gatewayName);
    
    Long countByStatus(PaymentStatus status);
    
    List<Transaction> findFailedTransactions();
    
    List<Transaction> findSuccessfulTransactions();
    
    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.gatewayName = :gatewayName AND t.status = 'COMPLETED'")
    Double sumSuccessfulAmountByGateway(@Param("gatewayName") String gatewayName);
    
    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.status = :status AND t.createdAt BETWEEN :start AND :end")
    Long countByStatusAndDateRange(@Param("status") PaymentStatus status, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
    
    @Query("SELECT t FROM Transaction t WHERE t.payment.id = :paymentId ORDER BY t.createdAt DESC")
    List<Transaction> findByPaymentIdOrderByCreatedAtDesc(@Param("paymentId") String paymentId);
}
