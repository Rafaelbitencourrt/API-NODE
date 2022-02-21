# API utilizada para criação de games.

## Endpoints

### GET /games

Esse endpoint é responsavel por retornar a listagem de todos os games cadastrados no banco de dados.

#### Parâmetros

Nenhum

#### Respostas

#### OK! 200

Caso essa resposta aconteça você irá receber a listagem de todos os games.

#### Falha na autenticação! 401

Caso essa resposta aconteça, isso significa que aconteceu alguma falha durante o processo de autenticação da requisição.
Motivos: token inválido, Token expirado.
