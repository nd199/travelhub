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
    
    @Query(value = "SELECT SUM(t.amount) FROM Transaction t WHERE t.gatewayName = :gatewayName", nativeQuery = true)
    Double sumAmountByGateway(@Param("gatewayName") String gatewayName);
    
    Long countByStatus(PaymentStatus status);
    
    @Query(value = "SELECT t FROM Transaction t WHERE t.status = 'FAILED'", nativeQuery = true)
    List<Transaction> findFailedTransactions();
    
    @Query(value = "SELECT t FROM Transaction t WHERE t.status = 'COMPLETED'", nativeQuery = true)
    List<Transaction> findSuccessfulTransactions();
    
    @Query(value = "SELECT SUM(t.amount) FROM Transaction t WHERE t.gatewayName = :gatewayName AND t.status = 'COMPLETED'", nativeQuery = true)
    Double sumSuccessfulAmountByGateway(@Param("gatewayName") String gatewayName);
    
    @Query(value = "SELECT COUNT(t) FROM Transaction t WHERE t.status = :status AND t.created_at BETWEEN :start AND :end", nativeQuery = true)
    Long countByStatusAndDateRange(@Param("status") PaymentStatus status, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
    
    @Query(value = "SELECT t FROM Transaction t WHERE t.payment_id = :paymentId ORDER BY t.created_at DESC", nativeQuery = true)
    List<Transaction> findByPaymentIdOrderByCreatedAtDesc(@Param("paymentId") String paymentId);
}
