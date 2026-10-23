package com.comp.workshop.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record NovoRecado(
		@NotBlank(message = "O autor é obrigatório")
		@Size(max = 50, message = "O autor deve ter no máximo 50 caracteres")
		String autor,

		@NotBlank(message = "O texto é obrigatório")
		@Size(max = 280, message = "O texto deve ter no máximo 280 caracteres")
		String texto) {
}
