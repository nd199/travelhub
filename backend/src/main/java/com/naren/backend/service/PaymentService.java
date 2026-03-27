package com.naren.backend.service;

import com.naren.backend.entity.Booking;
import com.naren.backend.entity.Payment;
import com.naren.backend.repository.BookingRepository;
import com.naren.backend.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;
    private final BookingService bookingService;

    public Payment processPayment(Long bookingId, Payment.PaymentMethod paymentMethod) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + bookingId));

        if (booking.getStatus() != Booking.BookingStatus.PENDING) {
            throw new RuntimeException("Booking is not in pending status");
        }

        // Check if payment already exists
        if (paymentRepository.findByBookingId(bookingId).isPresent()) {
            throw new RuntimeException("Payment already exists for this booking");
        }

        Payment payment = new Payment();
        payment.setTransactionId(generateTransactionId());
        payment.setAmount(booking.getTotalAmount());
        payment.setStatus(Payment.PaymentStatus.PENDING);
        payment.setPaymentMethod(paymentMethod);
        payment.setBooking(booking);

        Payment savedPayment = paymentRepository.save(payment);

        // Simulate payment processing
        // In real implementation, integrate with payment gateway (Stripe, Razorpay, etc.)
        try {
            // Simulate payment gateway call
            Thread.sleep(1000); // Simulate processing time
            
            // Mark payment as completed
            savedPayment.setStatus(Payment.PaymentStatus.COMPLETED);
            savedPayment.setPaymentGatewayTransactionId("PG" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
            savedPayment.setPaymentGatewayResponse("{\"status\":\"success\",\"message\":\"Payment processed successfully\"}");
            
            // Confirm booking
            bookingService.confirmBooking(bookingId);
            
        } catch (InterruptedException e) {
            savedPayment.setStatus(Payment.PaymentStatus.FAILED);
            savedPayment.setFailureReason("Payment processing interrupted");
            Thread.currentThread().interrupt();
        } catch (Exception e) {
            savedPayment.setStatus(Payment.PaymentStatus.FAILED);
            savedPayment.setFailureReason("Payment processing failed: " + e.getMessage());
        }

        return paymentRepository.save(savedPayment);
    }

    public Payment refundPayment(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found with id: " + paymentId));

        if (payment.getStatus() != Payment.PaymentStatus.COMPLETED) {
            throw new RuntimeException("Only completed payments can be refunded");
        }

        // Simulate refund processing
        try {
            Thread.sleep(1000); // Simulate processing time
            
            payment.setStatus(Payment.PaymentStatus.REFUNDED);
            payment.setRefundTransactionId("RF" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
            payment.setRefundAmount(payment.getAmount());
            payment.setRefundDate(LocalDateTime.now());
            
            // Cancel booking
            bookingService.cancelBooking(payment.getBooking().getId());
            
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Refund processing interrupted");
        }

        return paymentRepository.save(payment);
    }

    public Payment partialRefund(Long paymentId, BigDecimal refundAmount) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found with id: " + paymentId));

        if (payment.getStatus() != Payment.PaymentStatus.COMPLETED) {
            throw new RuntimeException("Only completed payments can be refunded");
        }

        if (refundAmount.compareTo(payment.getAmount()) > 0) {
            throw new RuntimeException("Refund amount cannot exceed payment amount");
        }

        // Simulate partial refund processing
        try {
            Thread.sleep(1000); // Simulate processing time
            
            payment.setStatus(Payment.PaymentStatus.PARTIALLY_REFUNDED);
            payment.setRefundTransactionId("PRF" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
            payment.setRefundAmount(refundAmount);
            payment.setRefundDate(LocalDateTime.now());
            
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Partial refund processing interrupted");
        }

        return paymentRepository.save(payment);
    }

    @Transactional(readOnly = true)
    public Payment getPaymentById(Long id) {
        return paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public Payment getPaymentByTransactionId(String transactionId) {
        return paymentRepository.findByTransactionId(transactionId)
                .orElseThrow(() -> new RuntimeException("Payment not found with transaction id: " + transactionId));
    }

    @Transactional(readOnly = true)
    public Payment getPaymentByBookingId(Long bookingId) {
        return paymentRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new RuntimeException("Payment not found for booking id: " + bookingId));
    }

    @Transactional(readOnly = true)
    public List<Payment> getPaymentsByStatus(Payment.PaymentStatus status) {
        return paymentRepository.findByStatus(status);
    }

    @Transactional(readOnly = true)
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    private String generateTransactionId() {
        return "TXN" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}
