package com.naren.backend.Repo;

import com.naren.backend.Entity.Payment;
import com.naren.backend.Entity.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, String> {
    List<Payment> findByBookingId(String bookingId);
    
    List<Payment> findByStatus(PaymentStatus status);
    
    List<Payment> findByMethod(String method);
    
    List<Payment> findByGatewayTransactionId(String gatewayTransactionId);
    
    List<Payment> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
    
    List<Payment> findByAmountBetween(double minAmount, double maxAmount);
    
    List<Payment> findByAmountGreaterThan(double minAmount);
    
    List<Payment> findByGatewayName(String gatewayName);
    
    Double sumAmountByStatus(PaymentStatus status);
    
    List<Payment> findByStatusAndCreatedAtBetween(PaymentStatus status, LocalDateTime start, LocalDateTime end);
    
    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.status = :status")
    Double sumAmountByStatus(@Param("status") PaymentStatus status);
    
    @Query("SELECT COUNT(p) FROM Payment p WHERE p.gatewayName = :gatewayName")
    Long countByGatewayName(@Param("gatewayName") String gatewayName);
    
    @Query("SELECT p FROM Payment p WHERE p.booking.id = :bookingId AND p.status = 'COMPLETED'")
    List<Payment> findCompletedPaymentsByBookingId(@Param("bookingId") String bookingId);
    
    @Query("SELECT p FROM Payment p WHERE p.createdAt BETWEEN :start AND :end ORDER BY p.createdAt DESC")
    List<Payment> findPaymentsInDateRange(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
}
