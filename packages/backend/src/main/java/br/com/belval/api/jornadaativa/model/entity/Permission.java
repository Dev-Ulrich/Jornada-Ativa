package br.com.belval.api.jornadaativa.model.entity;

public enum  Permission {

    ADMIN_READ("ADMIN_READ"),
    ADMIN_UPDATE("ADMIN_UPDATE"),
    ADMIN_CREATE("ADMIN_CREATE"),
    ADMIN_DELETE("ADMIN_DELETE"),
    CLIENTE_READ("CLIENTE_READ"),
    CLIENTE_UPDATE("CLIENTE_UPDATE"),
    CLIENTE_CREATE("CLIENTE_CREATE"),
    CLIENTE_DELETE("CLIENTE_DELETE");


    private String permission;

    Permission (String permission) {
        this.permission = permission;
    }
    public String getPermission() {
        return permission;
    }
}
