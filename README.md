# Picshar

Desarrollen el backend para un clon de Twitter + Instagram.

- La API debe satisfacer cada endpoint que está utilizando el frontend, de manera que el frontend funcione completamente. 
- La API debe crearse como repositorio en Github y debe ser "entregada" al profesor utilizando el enlace, donde se enviará unicamente el link al repositorio. 
- El proyecto se desarrolla en grupos de 3 personas, con fecha de entrega 29 de Mayo 23:59.

## Endpoints

- [X] Endpoint de login con usuario y contraseña
  - Debe generar un JWT de sesión
  - Metodo: POST
  - Ruta: '/users/login'
  - Body: { username, password }
  - Response: { token }
- [X] Endpoint de login con JWT token
  - Metodo: POST
  - Ruta: '/users/login'
  - Body: { token }
  - Response: {}
- [X] Endpoint de registro de usuario
  - Debe generar un JWT de sesión
  - Metodo: POST
  - Ruta: '/users/'
  - Body: { username, password, email, birthdate, bio }
  - Response: { token }


- [X] Endpoint de informacion de usuario
  - No debe tener información privada del usuario (contraseña, fecha de cumpleaños)
  - Debe incluir el numero de publicaciones que el usuario ha dado me gusta, calculado on-demand
  - Debe incluir el numero de publicaciones que el usuario ha subido, calculado on-demand
  - Debe incluir el numero de seguidores del usuario, calculado on-demand
  - Debe incluir el numero de seguidos del usuario, calculado on-demand
  - Metodo: GET
  - Ruta: '/users/'
  - Query: { user_id }
  - Response: { username, email, bio, liked_count, posts_count, followers_count, followed_count }
- [X] Endpoint de publicaciones que un usuario ha subido
  - Solo está permitido si el usuario esta siguiendo al usuario, a menos que sea el usuario mismo
  - Metodo: GET
  - Ruta: '/posts/'
  - Query: { author }
  - Response: { posts }
- [X] Endpoint de publicaciones que un usuario ha dado "me gusta"
  - Solo está permitido si el usuario permite ver sus "me gusta", a menos que sea el usuario mismo
  - Metodo: GET
  - Ruta: '/posts/liked-by'
  - Query: { user_id }
  - Response: { posts }
- [X] Endpoint de publicaciones que un usuario ha guardado
  - Solo está permitido para el usuario mismo
  - Metodo: GET
  - Ruta: '/posts/saved-by'
  - Query: { user_id }
  - Response: { posts }
- [X] Endpoint de usuarios seguidos por un usuario
  - Solo está permitido si el usuario esta siguiendo al usuario, a menos que sea el usuario mismo
  - Metodo: GET
  - Ruta: '/follows/following'
  - Query: { user_id }
  - Response: { users }
- [X] Endpoint de seguidores de un usuario
  - Solo está permitido si el usuario esta siguiendo al usuario, a menos que sea el usuario mismo
  - Metodo: GET
  - Ruta: '/follows/followers'
  - Query: { user_id }
  - Response: { users }

- [X] Endpoint de solicitar seguir a un usuario
  - Solo permitido si el usuario ya no está siguiendo al usuario
  - Metodo: POST
  - Ruta: '/follows/request'
  - Body: { user_id }
  - Response: {}
- [X] Endpoint de aceptar o rechazar solicitud de seguir
  - Solo está permitido si el usuario es el que recibe la solicitud
  - Metodo: POST
  - Ruta: '/follows/response'
  - Body: { request_id, action }
  - Response: {}
  - El campo 'action' corresponde a la string 'accept' o 'reject'.


- [X] Get timeline de un usuario
  - Debe ser paginada
  - Metodo: GET
  - Ruta: '/posts/timeline'
  - Body: { user_id }
  - Response: { posts }


- [X] Endpoint de crear/subir publicacion
  - Metodo: POST
  - Ruta: '/posts/'
  - Body: { img_url, bio, author }
  - Response: {  }
- [X] Endpoint de informacion de publicacion
  - Debe incluir el numero de likes de la publicacion, calculado on-demand
  - Debe incluir los comentarios de la publicacion, calculado on-demand
  - Metodo: GET
  - Ruta: '/posts/'
  - Body: { post_id }
  - Response: { img_url, bio, author, likes, comments }


- [X] Endpoint de dar me gusta a una publicación
  - Metodo: POST
  - Ruta: '/posts/like'
  - Body: { post_id }
  - Response: {  }
- [X] Endpoint de guardar una publicación
  - Metodo: POST
  - Ruta: '/posts/save'
  - Body: { post_id }
  - Response: {  }
- [X] Endpoint de comentar en una publicación
  - Metodo: POST
  - Ruta: '/posts/'
  - Body: { post_id, comment }
  - Response: {  }


## Pruebas Unitarias (Jest)

- [X] Login
  - [X] Informacion valida
  - [X] Informacion invalida (usuario no existe)
  - [X] Informacion invalida (contraseña incorrecta)
- [X] Registro
  - [X] Informacion completa
  - [X] Informacion incompleta


- [X] Informacion de Usuario
  - [X] Contraseña y fecha de cumpleaños no incluida en el response
  - [X] Numero de publicaciones del usuario refleja el numero correcto
  - [X] Numero de publicaciones que le gustan al usuario refleja el numero correcto
  - [X] Numero de seguidores refleja el numero correcto
  - [X] Numero de seguidos refleja el numero correcto


- [X] Lista de seguidores de un usuario
- [X] Lista de seguidos de un usuario
- [X] Solicitar seguir
- [X] Aceptar solicitud
  - [X] Aceptar solicitud previamente aceptada o rechazada
- [X] Rechazar solicitud
  - [X] Rechazar solicitud previamente aceptada o rechazada


- [X] Dar me gusta a publicacion
- [X] Publicaciones "gustadas" por un usuario
- [X] Guardar publicacion
- [X] Publicaciones guardadas por un usuario
- [X] Comentar publicacion
- [X] Comentarios de una publicacion