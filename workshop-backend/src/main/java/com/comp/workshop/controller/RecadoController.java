package com.comp.workshop.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.comp.workshop.dto.NovoRecado;
import com.comp.workshop.model.Recado;
import com.comp.workshop.repository.RecadoRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/recados")
public class RecadoController {

	private final RecadoRepository repository;

	public RecadoController(RecadoRepository repository) {
		this.repository = repository;
	}

	@GetMapping
	public List<Recado> listar() {
		return repository.findAllByOrderByCriadoEmDesc();
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public Recado criar(@Valid @RequestBody NovoRecado novo) {
		return repository.save(new Recado(novo.autor(), novo.texto()));
	}

	@DeleteMapping("/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void excluir(@PathVariable Long id) {
		if (!repository.existsById(id)) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Recado não encontrado");
		}
		repository.deleteById(id);
	}

}
