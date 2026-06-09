// =====================================
// CONEXIÓN SUPABASE
// =====================================


const supabaseUrl =
  'https://slfkcjsiifbbkyikzfjh.supabase.co'

const supabaseKey =
  'sb_publishable_YvSnaYdoWm8wEfQsZk0VUQ_Pr_nCiz7'

const supabaseClient =
  window.supabase.createClient(
    supabaseUrl,
    supabaseKey
  );


// =====================================
// =====================================


// =====================================
// VARIABLES
// =====================================

let partidosVisibles = [];


// =====================================
// CARGAR PARTIDOS
// =====================================

async function cargarPartidos() {

  const { data, error } =
    await supabaseClient
      .from("partidos")
      .select("*")
      .order("fecha_hora");

  if(error){

    console.error(error);
    return;

  }

  console.log(data);

  partidosVisibles = data;

  mostrarPartidos();

}


// =====================================
// MOSTRAR PARTIDOS
// =====================================

function mostrarPartidos(){

  const div =
    document.getElementById(
      "partidos"
    );

  div.innerHTML = "";

  partidosVisibles.forEach(
    partido => {

      const fecha =
        new Date(
          partido.fecha_hora
        );

      const cerrado =
        fecha <= new Date();

      div.innerHTML += `

      <div class="partido">

        <h3>

          ${partido.equipo1}

          vs

          ${partido.equipo2}

        </h3>

        <p>

          ${fecha.toLocaleString()}

        </p>

        <p>

          Grupo ${partido.grupo}

        </p>

        ${
          cerrado

          ?

          `<p class="cerrado">

            Pronóstico cerrado

          </p>`

          :

          `

          <div class="equipos">

            <input
              type="number"
              min="0"
              id="p1_${partido.match_id}"
            >

            -

            <input
              type="number"
              min="0"
              id="p2_${partido.match_id}"
            >

          </div>

          `

        }

      </div>

      `;

    }
  );

}


// =====================================
// ENVIAR PRONÓSTICOS
// =====================================

async function enviarPronosticos(){

  const nombre =
    document
      .getElementById(
        "nombre"
      )
      .value;

  if(!nombre){

    alert(
      "Ingrese su nombre"
    );

    return;

  }

  const registros = [];

  partidosVisibles.forEach(
    partido => {

      const g1 =
        document.getElementById(
          `p1_${partido.match_id}`
        );

      const g2 =
        document.getElementById(
          `p2_${partido.match_id}`
        );

      if(
        g1 &&
        g2 &&
        g1.value !== "" &&
        g2.value !== ""
      ){

        registros.push({

          usuario: nombre,

          match_id:
            partido.match_id,

          pred_local:
            Number(
              g1.value
            ),

          pred_visita:
            Number(
              g2.value
            ),

          fecha_envio:
            new Date()

        });

      }

    }
  );

  if(
    registros.length === 0
  ){

    alert(
      "No hay pronósticos para enviar"
    );

    return;

  }

  const { error } =
    await supabaseClient
      .from(
        "pronosticos"
      )
      .insert(
        registros
      );

  if(error){

    console.error(error);

    alert(
      "Error al guardar"
    );

    return;

  }

  document
    .getElementById(
      "mensaje"
    )
    .innerHTML =
      "✅ Pronósticos guardados";

}


// =====================================
// INICIAR
// =====================================

cargarPartidos();
