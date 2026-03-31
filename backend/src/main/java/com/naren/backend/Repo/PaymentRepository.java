package com.naren.backend.Repo;

import com.naren.backend.Entity.Payment;
import com.naren.backend.Entity.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, String> {
    List<Payment> findByBookingId(String bookingId);

    List<Payment> findByStatus(PaymentStatus status);

    List<Payment> findByMethod(String method);
}
