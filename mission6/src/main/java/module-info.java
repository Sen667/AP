module org.example.fripouilles {
    requires javafx.controls;
    requires javafx.fxml;
    requires javafx.web;

    requires net.synedra.validatorfx;
    requires org.kordamp.ikonli.javafx;
    requires org.kordamp.bootstrapfx.core;
    requires eu.hansolo.tilesfx;

    requires com.google.gson;
    requires java.desktop;
    requires okhttp3;

    opens org.example.fripouilles to javafx.fxml;

    exports org.example.fripouilles;

    opens org.example.fripouilles.controller to javafx.fxml;

    exports org.example.fripouilles.controller;

    opens org.example.fripouilles.model to com.google.gson;

    exports org.example.fripouilles.model;

    opens org.example.fripouilles.model.creche to com.google.gson;

    exports org.example.fripouilles.model.creche;

    exports org.example.fripouilles.service;
}