INSERT INTO recado (autor, texto, criado_em) VALUES
  ('Diretoria COMP', 'Bem-vindos ao workshop de Spring + React!', DATEADD('MINUTE', -30, CURRENT_TIMESTAMP)),
  ('João', 'Esse recado veio do data.sql, direto para o H2.', DATEADD('MINUTE', -20, CURRENT_TIMESTAMP)),
  ('Maria', 'Mal posso esperar para criar o meu pelo formulário.', DATEADD('MINUTE', -10, CURRENT_TIMESTAMP));
