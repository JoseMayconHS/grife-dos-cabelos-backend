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
	- `/app/expo` : Regista o dispositivo no bando de dados;
	- `/admin/dashboard/expo` : Manda notificação à todos os dispositivos conectados ao app;
	- `/admin/dashboard/brand` : Cria uma marca;
	- `/admin/dashboard/product` : Cria um produto;
	- `/admin/dashboard/reconnect` : Reconecta à aplicação.
- GET
	- `/private/app/swiper` : Retorna produtos para o Swiper Component do App;
	- `/private/both/brand/:page` : Busca marcas;	
	- `/private/both/product/:page` : Busca todos os produtos;
	-	`/private/both/product/by/:page` : Realiza um filtro nos produtos;
	- `/private/both/brand/by/:page` : Realiza um filtro nas marcas;
	- `/private/both/product/search/:word/:page` : Pesquisa por porduto;
	- `/private/both/brand/search/:word/:page` : Pesquisa por marcas;
	- `/admin/dashboard/user/search/:word/:page` : Pesquisa por clientes;
	- `/admin/dashboard/user/:page` : Busca todos os usuários;
	- `/admin/dashboard/qtd/:collection` : Retorna a quantidade de de dedos da coleção.
- PUT
	- `/private/app/user` : Atualiza um usuário;
	- `/admin/dashboard/product/:_id` : Atualiza um produto;	
	- `/admin/dashboard/brand/:_id` : Atualiza uma marca.
- DELETE
	- `/admin/dashboard/brand/:_id` : Delete uma marca;
	- `/admin/dashboard/product/:_id` : Deleta um produto;
	- `/admin/dashboard/user/:_id` : Deleta um cliente;
