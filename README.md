# grife-dos-cabelos-API
API para auxiliar no desenvolvimento do aplicativo.

## App
 - [Projeto](https://github.com/Maycon-PE/grife-dos-cabelos-App "Ir ao repositório")

## Dimenções de imagens
	- pequena 27x43;
	- média 61x97;
	- grande 81x129

## Endpointers
	- STATIC
		- `/files` : serve arquivos estáticos.
	- POST
		- `/product` : criar um produto;
		- `/user/signup` : cria um usuário;
		- `/user/signin` : realiza o login do usuário.
	- GET
		-	`/product?:type` : realiza um filtro nos produtos;
		- `/product` : busca todos os produtos;
		- `/user` : busca todos os usuários.
	- PUT
		- `/product/:id` : Atualiza um produto;
		- `/user/:id` : Atualiza um usuário.
