# grife-dos-cabelos-API
API para auxiliar no desenvolvimento do aplicativo.

## App
 - [Projeto](https://github.com/Maycon-PE/grife-dos-cabelos-App "Ir ao repositório")

## Endpointers

- STATIC
	- `/files` : serve arquivos estáticos.
- POST
	- `/app/user/signup` : Cria um usuário;
	- `/app/user/signin` : Realiza o login do usuário;
	- `/admin/dashboard/brand` : Cria uma marca;
	- `/admin/dashboard/product` : Cria um produto.
- GET
	- `/both/brand/:page` : Busca marcas;
	-	`/both/product/by/:page` : realiza um filtro nos produtos;
	- `/both/product/:page` : busca todos os produtos;
	- `/admin/dashboard/user/:page` : busca todos os usuários.
- PUT
	- `/private/app/user` : Atualiza um usuário;
	- `/admin/dashboard/product/:id` : Atualiza um produto;	
	- `/admin/dashboard/brand/:_id` : Atualiza uma marca.
- DELETE
	- `/admin/dashboard/brand/:_id` : Delete uma marca;
	- `/admin/dashboard/product/:_id` : Deleta um produto;
	- `/admin/dashboard/user/:_id` : Deleta um cliente;
