package com.comp.workshop.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.comp.workshop.model.Recado;

public interface RecadoRepository extends JpaRepository<Recado, Long> {

	List<Recado> findAllByOrderByCriadoEmDesc();

}
