FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY WebApplication/ .
RUN dotnet restore

COPY . .
RUN dotnet build -o /app
RUN dotnet publish -o /publish

WORKDIR /publish
ENV ASPNETCORE_URLS=http://+:7126/
EXPOSE 7126

HEALTHCHECK CMD curl --fail http://localhost || exit 1

CMD ["./API"]
