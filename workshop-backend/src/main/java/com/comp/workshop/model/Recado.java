package com.comp.workshop.model;

import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;

@Entity
public class Recado {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, length = 50)
	private String autor;

	@Column(nullable = false, length = 280)
	private String texto;

	@Column(nullable = false, updatable = false)
	private Instant criadoEm;

	protected Recado() {
	}

	public Recado(String autor, String texto) {
		this.autor = autor;
		this.texto = texto;
	}

	@PrePersist
	void aoCriar() {
		criadoEm = Instant.now();
	}

	public Long getId() {
		return id;
	}

	public String getAutor() {
		return autor;
	}

	public String getTexto() {
		return texto;
	}

	public Instant getCriadoEm() {
		return criadoEm;
	}

}
