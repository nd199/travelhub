package com.naren.backend.repository;

import com.naren.backend.entity.Payment;
import com.naren.backend.entity.PaymentStatus;
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

    List<Payment> findByStatusAndCreatedAtBetween(PaymentStatus status, LocalDateTime start, LocalDateTime end);
    
    @Query(value = "SELECT SUM(p.amount) FROM Payment p WHERE p.status = :status", nativeQuery = true)
    Double sumAmountByStatus(@Param("status") PaymentStatus status);
    
    @Query(value = "SELECT COUNT(p) FROM Payment p WHERE p.gateway_name = :gatewayName", nativeQuery = true)
    Long countByGatewayName(@Param("gatewayName") String gatewayName);
    
    @Query(value = "SELECT p FROM Payment p WHERE p.booking_id = :bookingId AND p.status = 'COMPLETED'", nativeQuery = true)
    List<Payment> findCompletedPaymentsByBookingId(@Param("bookingId") String bookingId);
    
    @Query(value = "SELECT p FROM Payment p WHERE p.created_at BETWEEN :start AND :end ORDER BY p.created_at DESC", nativeQuery = true)
    List<Payment> findPaymentsInDateRange(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
}
