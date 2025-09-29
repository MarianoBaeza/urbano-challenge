# Challenge Técnico Urbano Express - Fullstack (NestJS + React + Docker)

La solución fue construida priorizando la **simplicidad**, la **escalabilidad** y la **resolución de errores encontrados durante el desarrollo**.  

---

## 🚀 Tecnologías Utilizadas

- **Backend**: [NestJS](https://nestjs.com/) (Node.js + TypeScript)  
- **Frontend**: [React](https://react.dev/) 
- **Contenedores**: [Docker](https://www.docker.com/) + `docker-compose`  

---

## 🛠️ Decisiones Técnicas y Cambios Relevantes

- Migración de **Craco a Vite** en el frontend para mejorar tiempos de compilación y simplicidad en la configuración.  
- Incorporación de **Zustand** para el manejo de estado global, brindando un flujo más claro y escalable.  
- Simplificación de la estructura de algunos componentes y servicios para asegurar mayor mantenibilidad.  
- Configuración de **Docker** para levantar toda la aplicación (frontend + backend + base de datos) con un solo comando.  
- Resolución iterativa de errores de ejecución y configuración, aplicando la solución más clara y escalable en cada caso.  

---

## ▶️ Ejecución del Proyecto

La aplicación está completamente dockerizada, por lo que no es necesario instalar dependencias manualmente en el host.  

1. Clonar este repositorio:
   ```bash
   git clone <URL_DEL_REPO>
   cd <NOMBRE_DEL_REPO>
   ```

2. Levantar los servicios con Docker:
   ```bash
   docker-compose up --build
   ```

---

## 📌 Notas

- El proyecto fue diseñado para ser **fácilmente escalable**, de modo que nuevas funcionalidades se puedan agregar sin necesidad de grandes refactorizaciones.  
- Se priorizó el uso de **herramientas modernas y ligeras** que simplificaran la configuración y el desarrollo.  
- El enfoque estuvo en entregar una solución funcional, clara y escalable en el tiempo.  

---
