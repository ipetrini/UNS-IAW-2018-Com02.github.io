var tabla;
var listaJornadas;
var equipos;
var jornadaDeseada;
var jornadaActual = 30;

$(document).ready(function () {

    var guardado = localStorage.getItem("style");
    if (guardado === null) {
        var estilo = "css/iaw-p0.css";
        $("#estilo").attr("href", estilo);
        localStorage.setItem("style", estilo);
    } else
        $("#estilo").attr("href", guardado);

});

function cambiarEstilo() {
    var estiloActual = localStorage.getItem("style");
    var estiloNuevo;
    if (estiloActual === "css/iaw-p0.css") {
        $('#estilo').attr('href', 'css/iaw-p0-est2.css');
        estiloNuevo = "css/iaw-p0-est2.css";
    } else {
        $('#estilo').attr('href', 'css/iaw-p0.css');
        estiloNuevo = "css/iaw-p0.css";
    }
    window.localStorage.setItem("style", estiloNuevo);
}

function abrirIndex() {

    abrirTablaReducida();
    abrirJornadas();
    abrirNoticias();
}

function abrirTablaReducida() {

    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            data = this.responseText;

            var tablaOrdenada = ordenarTabla(JSON.parse(data));
            mostrarTablaReducida(tablaOrdenada);

        }
    };
    xmlhttp.open("GET", './data/equipos.json', true);
    xmlhttp.send();
}


function abrirTabla() {

    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            data = this.responseText;

            var tablaOrdenada = ordenarTabla(JSON.parse(data));
            mostrarTabla(tablaOrdenada);

        }
    };
    xmlhttp.open("GET", './data/equipos.json', true);
    xmlhttp.send();
}


function abrirJugadores(id, cell) {
    $("#tabla_equipos1").find("*").css('backgroundColor', "");
    $("#tabla_equipos2").find("*").css('backgroundColor', "");
    $("#tabla_equipos3").find("*").css('backgroundColor', "");
    $("#tabla_equipos4").find("*").css('backgroundColor', "");
    $("#tabla_equipos5").find("*").css('backgroundColor', "");

    var estiloActual = localStorage.getItem("style");
    if (estiloActual === "css/iaw-p0.css") {
        cell.style.backgroundColor = "#99FF99";
    } else {
        cell.style.backgroundColor = "red";
    }

    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            equipos = this.responseText;
            mostrarJugadores(equipos, id);
        }
    };
    xmlhttp.open("GET", './data/equipos.json', true);
    xmlhttp.send();
}


function abrirEquipos() {

    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            equipos = this.responseText;
            mostrarEquipos(equipos);

        }
    };
    xmlhttp.open("GET", './data/equipos.json', true);
    xmlhttp.send();
}


function abrirJornadas() {

    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            listaJornadas = this.responseText;

            mostrarCalendario(ordenarJornadas(listaJornadas));

            mostrarCalendarioCompleto(listaJornadas);

        }
    };
    xmlhttp.open("GET", './data/jornadas.json', true);
    xmlhttp.send();

}

function abrirNoticias() {

    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            noticias = this.responseText;
            mostrarNoticiasReducidas(noticias);
        }
    };
    xmlhttp.open("GET", './data/noticias.json', true);
    xmlhttp.send();

}

function agregarDia(fecha) {
    var subtitulo = $("<th></th>").attr("colspan", "3").attr("class", "text-left table-dark").text(fecha);
    $("#calendario").append($("<tr></tr>").append(subtitulo));
}

function agregarPartido(partido) {
    var row = $("<tr></tr>").attr("class", "partido-cal");
    row.append($("<td></td").text(partido.equipo_local));
    row.append($("<td></td").append($("<span></span>").attr("class", "badge badge-pill badge-danger").text(partido.horario)));
    row.append($("<td></td").text(partido.equipo_visitante));
    $("#calendario").append(row);
}

function buscarEstadisticas() {

    buscarJugadores();

    estadisticasPorEquipo();

}

function buscarJugadores() {
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            equiposJSON = this.responseText;
            var equipos = JSON.parse(equiposJSON);

            var jugadores = new Array();

            $.each(equipos, function (i, equipo) {
                $.each(equipo.jugadores, function (j, jugador) {
                    jugador.equipo = equipo.escudo;
                    jugadores[jugadores.length] = jugador;
                });
            });

            ordenarEstadisticas(jugadores, "goles");
            mostrarMaximos(jugadores, "goles");
            ordenarEstadisticas(jugadores, "asistencias");
            mostrarMaximos(jugadores, "asistencias");
            ordenarEstadisticas(jugadores, "amarillas");
            mostrarMaximos(jugadores, "amarillas");
            ordenarEstadisticas(jugadores, "rojas");
            mostrarMaximos(jugadores, "rojas");


        }
    };
    xmlhttp.open("GET", './data/equipos.json', true);
    xmlhttp.send();

}

function buscarJornada(event) {

//Saco el número de la jornada que está mostrando cuando tocó el boton.
    var nroJornadaActual = $("#nroJornada").text().trim();
    var nro = parseInt(nroJornadaActual.substring(8, nroJornadaActual.length));
    if (event.id === "btn_jornada_siguiente") {
        obtenerJornada(nro + 1);
    } else {
        obtenerJornada(nro - 1);
    }
}

function mostrarMaximosEquipos(array, t) {
    var nom_tabla;
    var subs;
    if (t === "goles_a_favor") {
        nom_tabla = "#tabla_gf_equipo";
        subs = "Goles a favor";
    } else if (t === "goles_en_contra") {
        nom_tabla = "#tabla_gc_equipo";
        subs = "Goles en contra";
    } else {
        nom_tabla = "#tabla_promedio_gol";
        subs = "Promedio de Gol";
    }

    var index;
    var img;

    var subtitulo = $("<th></th>").attr("colspan", "3").attr("class", "text-center table-dark").text(subs);
    $(nom_tabla).append($("<tr></tr>").append(subtitulo));
    for (index = 0; index < 5; index++) {
        var row = $("<tr></tr>").attr("scope", "row");
        img = array[index].escudo;
        row.append($("<td></td>").text(index + 1));
        row.append($("<td></td>").text(array[index].nombre_equipo).append($("<img>").attr("src", img).attr("class", "escudo tabla-laliga").attr("align", "left")));
        row.append($("<td></td>").text(array[index][t]));
        $(nom_tabla).append(row);
    }

}


function mostrarMaximos(array, t) {
    var nom_tabla;
    var subs;
    if (t === "goles") {
        nom_tabla = "#tabla_goleadores";
        subs = "Goleadores";
    } else if (t === "asistencias") {
        nom_tabla = "#tabla_asistencias";
        subs = "Asistencias";
    } else if (t === "amarillas") {
        nom_tabla = "#tabla_amarillas";
        subs = "Tarjetas Amarillas";
    } else {
        nom_tabla = "#tabla_rojas";
        subs = "Tarjetas Rojas";
    }

    var index;
    var img;

    var subtitulo = $("<th></th>").attr("colspan", "3").attr("class", "text-center table-dark").text(subs);
    $(nom_tabla).append($("<tr></tr>").append(subtitulo));
    for (index = 0; index < 10; index++) {
        var row = $("<tr></tr>").attr("scope", "row");
        img = array[index].equipo;
        row.append($("<td></td>").text(index + 1));
        row.append($("<td></td>").text(array[index].nombre_jugador).append($("<img>").attr("src", img).attr("class", "escudo tabla-laliga").attr("align", "left")));
        row.append($("<td></td>").text(array[index][t]));
        $(nom_tabla).append(row);
    }

}


function mostrarJugadores(equipos, id) {
    var objeto = JSON.parse(equipos);
    $.each(objeto, function (i, equipo) {
        if (equipo.id_equipo === id) {
            $("#tabla_jugadores_body tr").remove();
            if (equipo.jugadores === undefined) {
                var row = $("<tr></tr>").attr("scope", "row");
                row.append($("<td></td>").text("No hay jugadores para mostrar.").attr("colspan", "8"));
                $("#tabla_jugadores_body").append(row);
            }
            ;
            $.each(equipo.jugadores, function (j, jugador) {
                var row = $("<tr></tr>").attr("scope", "row");
                row.append($("<td></td>").text(jugador.dorsal));
                row.append($("<td></td>").text(jugador.nombre_jugador));
                row.append($("<td></td>").text(jugador.nacionalidad));
                row.append($("<td></td>").text(jugador.edad));
                row.append($("<td></td>").text(jugador.posicion));
                row.append($("<td></td>").text(jugador.goles));
                row.append($("<td></td>").text(jugador.asistencias));
                row.append($("<td></td>").text(jugador.amarillas));
                row.append($("<td></td>").text(jugador.rojas));
                $("#tabla_jugadores_body").append(row);
            });

            return false;
        }
    });
    $("#tabla_jugadores").show();
}

function mostrarEquipos(data) {

    var objeto = JSON.parse(data);
    var tabla = "#tabla_equipos";
    var cont = 1;
    var img;

    objeto.sort(
            function (a, b) {
                if (a.nombre_equipo > b.nombre_equipo)
                    return 1;
                else
                    return -1;
            }
    );

    $.each(objeto, function (i, equipo) {
        if (cont > 5)
            cont = 1;
        img = equipo.escudo;
        var row = $("<tr></tr>").attr("scope", "row");
        row.append($("<td></td>").attr("onclick", "abrirJugadores(" + equipo.id_equipo + ", this);").append($("<span></span>").text(equipo.nombre_equipo).attr("class", "nombre-equipo")).append($("<img>").attr("src", img).attr("class", "escudo tabla-equipos").attr("align", "left")));
        $(tabla + cont).append(row);
        cont++;
    });
}

function mostrarTabla(equipos) {

    var img;
    for (index = 0; index < equipos.length; index++) {
        img = equipos[index].escudo;
        var row = $("<tr></tr>").attr("scope", "row");
        row.append($("<td></td>").text(index + 1));
        row.append($("<td></td>").attr("class", "text-left table-club").append($("<span></span>").text(equipos[index].nombre_equipo).attr("class", "nombre-equipo-tabla")).append($("<span></span>").text(equipos[index].nombre_equipo_movil).attr("class", "nombre-equipo-movil")).append($("<img>").attr("src", img).attr("class", "escudo-tabla").attr("align", "left")));
        row.append($("<td></td>").text(equipos[index].partidos_jugados));
        row.append($("<td></td>").text(equipos[index].partidos_ganados));
        row.append($("<td></td>").text(equipos[index].partidos_empatados));
        row.append($("<td></td>").text(equipos[index].partidos_perdidos));
        row.append($("<td></td>").text(equipos[index].puntos).css("font-weight", "bold"));
        row.append($("<td></td>").text(equipos[index].goles_a_favor));
        row.append($("<td></td>").text(equipos[index].goles_en_contra));
        row.append($("<td></td>").text(equipos[index].dif_gol));
        $("#tabla_pos_completa").append(row);
    }

}


function mostrarTablaReducida(equipos) {

    var img;
    for (index = 0; index < equipos.length; index++) {
        img = equipos[index].escudo;
        var row = $("<tr></tr>").attr("scope", "row");
        row.append($("<td></td>").text(index + 1));
        row.append($("<td></td>").text(equipos[index].nombre_equipo).append($("<img>").attr("src", img).attr("class", "escudo tabla-laliga").attr("align", "left")));
        row.append($("<td></td>").text(equipos[index].puntos));
        row.append($("<td></td>").text(equipos[index].partidos_jugados));
        row.append($("<td></td>").text(equipos[index].dif_gol));
        $("#tabla_pos").append(row);
    }
}


function mostrarNoticiasReducidas(noticias) {
    var objeto = JSON.parse(noticias);
    var index = 0;
    $.each(objeto, function (i, noticia) {

        if (noticia.categoria === "principal") {
            var c;
            var it;
            if (index === 0) {
                c = "active";
                it = "carousel-item active";
            } else {
                c = "";
                it = "carousel-item";
            }
            var li = $("<li></li>").attr("data-target", "#carousel-noticias").attr("data-slide-to", index).attr("class", c);
            $("#carousel-slide").append(li);
            var img = $("<img>").attr("class", "d-block w-100").attr("src", noticia.imagen);
            var hiper = $("<a></a>").attr("href", "noticia.html?noticia=" + noticia.titulo).append(img);

            var div2 = $("<div></div>").attr("class", "carousel-caption d-none d-md-block").append($("<a></a>").text(noticia.titulo).attr("class", "titulo").attr("href", "noticia.html?noticia=" + noticia.titulo).css("color", "white"));
            var div = $("<div></div>").attr("class", it).append(hiper).append(div2);
            $("#carousel-inn").append(div);
        } else {
            var img = $("<img>").attr("class", "card-img-top img-noticia-reducida").attr("src", noticia.imagen);
            var hiper = $("<a></a>").attr("href", "noticia.html?noticia=" + noticia.titulo).append(img);
            var div2 = $("<div></div>").attr("class", "card-body").append($("<a></a>").text(noticia.titulo).attr("href", "noticia.html?noticia=" + noticia.titulo).attr("class", "titulo card-title")).append($("<p></p>").text(noticia.sintesis).attr("class", "card-text mt-2"));
            var div = $("<div></div>").attr("class", "card text-justify").attr("id", "card-cuerpo").append(hiper).append(div2);
            $("#noticias-sec").append($("<div></div>").attr("class","col-sm-6").append(div));
        }
        index++;
    });
}

function mostrarNoticia() {
    var url_string = window.location.href;
    var url = new URL(url_string);
    var n = url.searchParams.get("noticia");

    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            noticias = this.responseText;
            var objeto = JSON.parse(noticias);
            $.each(objeto, function (i, noticia) {
                if (noticia.titulo === n) {
                    mostrarNoticiaCompleta(noticia);
                    return false;
                }
            });
        }
    }
    xmlhttp.open("GET", './data/noticias.json', true);
    xmlhttp.send();
}



function mostrarNoticiaCompleta(noticia) {
    var img = $("<img>").attr("class", "img-noticia mt-3 mb-3").attr("src", noticia.imagen);
    var titulo = $("<h3></h3>").attr("class", "titulo-noticia").text(noticia.titulo);
    var sint = $("<h4></h4>").attr("class", "cuerpo-noticia").text(noticia.sintesis);
    var cuerpo = $("<p></p>").attr("class", "cuerpo-noticia").text(noticia.cuerpo);
    $("#noticia").append(img);
    $("#noticia").append(titulo);
    $("#noticia").append(sint);
    $("#noticia").append(cuerpo);
}


function mostrarCalendario(fechas) {

    var index;
    for (var fecha in fechas) {
        agregarDia(fecha);
        var partidosPorDia = fechas[fecha];
        for (index = 0; index < partidosPorDia.length; ++index) {
            agregarPartido(partidosPorDia[index]);
        }
    }
}

function mostrarCalendarioCompleto(data) {

    var objeto = JSON.parse(data);
    var jornadas = new Array();
    $.each(objeto, function (i, obj) {
        var jornada = obj;
        jornadas[jornadas.length] = jornada;
    });
    var pxJornada = jornadas[jornadaActual - 1];
    //Mostramos en el fixture

    $("#nroJornada").text("Jornada " + pxJornada.numero);
    var partidos = pxJornada.partidos;
    for (index = 0; index < partidos.length; index++) {
        var row = $("<tr></tr>").attr("scope", "row");
        row.append($("<td></td>").text(partidos[index].fecha));
        row.append($("<td></td>").text(partidos[index].horario));
        row.append($("<td></td>").text(partidos[index].equipo_local));

        var resultado = partidos[index].resultado;

        var RL = resultado.substring(0, 1);
        var RV = resultado.substring(1, 2);
        if (RL === "-")
            row.append($("<td></td").append($("<span></span>").attr("class", "badge badge-pill badge-danger").text("vs")));
        else
            row.append($("<td></td").append($("<span></span>").attr("class", "badge badge-pill badge-danger").text(RL + " - " + RV)));

        row.append($("<td></td>").text(partidos[index].equipo_visitante));
        row.append($("<td></td>").attr("class", "tabla-estadio").text(partidos[index].estadio));
        row.append($("<td></td>").attr("class", "tabla-arbitro").text(partidos[index].arbitro));
        $("#tabla_fixture").append(row);
    }
}

function obtenerJornada(nro) {

    var j;

    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            listaJornadas = this.responseText;
            var objeto = JSON.parse(listaJornadas);
            $.each(objeto, function (i, jornada) {
                if (jornada.numero === nro) {
                    j = jornada;
                }
            });

            if (j !== undefined) {
                $("#nroJornada").text("Jornada " + j.numero);
				
                var partidos = j.partidos;

                $("#tabla_fixture").empty();

                if (nro === 1)
                    $("#btn_jornada_anterior").css("visibility", "hidden");
                else
                    $("#btn_jornada_anterior").css("visibility", "visible");

                if (nro === 38)
                    $("#btn_jornada_siguiente").css("visibility", "hidden");
                else
                    $("#btn_jornada_siguiente").css("visibility", "visible");


                for (index = 0; index < partidos.length; index++) {
                    var row = $("<tr></tr>").attr("scope", "row");
                    row.append($("<td></td>").text(partidos[index].fecha));
                    row.append($("<td></td>").text(partidos[index].horario));
                    row.append($("<td></td>").text(partidos[index].equipo_local));
                    var resultado = partidos[index].resultado;

                    var RL = resultado.substring(0, 1);
                    var RV = resultado.substring(1, 2);
                    if (RL === "-")
                        row.append($("<td></td").append($("<span></span>").attr("class", "badge badge-pill badge-danger").text("vs")));
                    else
                        row.append($("<td></td").append($("<span></span>").attr("class", "badge badge-pill badge-danger").text(RL + " - " + RV)));

                    row.append($("<td></td>").text(partidos[index].equipo_visitante));
                    row.append($("<td></td>").text(partidos[index].estadio));
                    row.append($("<td></td>").text(partidos[index].arbitro));
                    $("#tabla_fixture").append(row);
                }
            }
        }
    };
    xmlhttp.open("GET", './data/jornadas.json', true);
    xmlhttp.send();


}

function ordenarJornadas(data) {

    var objeto = JSON.parse(data);
    var jornadas = new Array();

    $.each(objeto, function (i, obj) {
        jornadas[jornadas.length] = obj;
    });

    var index;
    var j = new Object(); 
    var jActual = jornadas[jornadaActual - 1].partidos;
    $("#num-jornada").html("Jornada " + jornadas[jornadaActual - 1].numero);
    for (index = 0; index < jActual.length; ++index) {
        var partido = jActual[index];
        var partidosPorDia;
        if (j.hasOwnProperty(partido.fecha))
            partidosPorDia = j[partido.fecha];
        else {
            partidosPorDia = new Array();
            j[partido.fecha] = partidosPorDia;
        }
        partidosPorDia[partidosPorDia.length] = partido;
    }
    return j;
}

function ordenarEstadisticas(array, prop) {

    array.sort(
            function (a, b) {
                if (a[prop] < b[prop])
                    return 1;
                else
                    return -1;
            }
    );

}

function ordenarTabla(data) {
    var index;
    var equipos = new Array();
    $.each(data, function (i, obj) {
        var equipo = obj;
        equipo.puntos = equipo.partidos_ganados * 3 + equipo.partidos_empatados;
        equipo.dif_gol = equipo.goles_a_favor - equipo.goles_en_contra;
        equipos[equipos.length] = equipo;
    });
    equipos.sort(
            function (a, b) {
                if (a.puntos < b.puntos)
                    return 1;
                else if (a.puntos > b.puntos)
                    return -1;
                else {
                    if ((a.goles_a_favor - a.goles_en_contra) < (b.goles_a_favor - b.goles_en_contra))
                        return 1;
                    else if ((a.goles_a_favor - a.goles_en_contra) > (b.goles_a_favor - b.goles_en_contra))
                        return -1;
                    else {
                        if (a.goles_a_favor > b.goles_a_favor)
                            return 1;
                        else if (a.goles_a_favor < b.goles_a_favor)
                            return -1;
                        else
                            return 0;
                    }
                }
            }
    );
    return equipos;
}

function estadisticasPorEquipo() {
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            equiposJSON = this.responseText;
            var equipos = JSON.parse(equiposJSON);

            $.each(equipos, function (i, equipo) {
                var n = Math.round((equipo.goles_a_favor / equipo.partidos_jugados) * 100) / 100;
                equipo.promedio_gol = n;
            });

            ordenarEstadisticas(equipos, "goles_a_favor");
            mostrarMaximosEquipos(equipos, "goles_a_favor");
            ordenarEstadisticas(equipos, "goles_en_contra");
            mostrarMaximosEquipos(equipos, "goles_en_contra");
            ordenarEstadisticas(equipos, "promedio_gol");
            mostrarMaximosEquipos(equipos, "promedio_gol");



        }
    };
    xmlhttp.open("GET", './data/equipos.json', true);
    xmlhttp.send();

}
