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
// CARGAR PARTIDOS
// =====================================

async function cargarPartidos() {

  const { data, error } =
    await supabaseClient
      .from('partidos')
      .select('*')
      .eq('visible', true);

  if(error){
    console.error(error);
    return;
  }

  const contenedor =
    document.getElementById("partidos");

  contenedor.innerHTML = "";

  data.forEach(partido => {

    contenedor.innerHTML += `

      <div style="margin-bottom:20px">

        <h3>
          ${partido.local} vs ${partido.visita}
        </h3>

        <input
          type="number"
          min="0"
          id="local_${partido.match_id}"
          placeholder="${partido.local}"
        >

        -

        <input
          type="number"
          min="0"
          id="visita_${partido.match_id}"
          placeholder="${partido.visita}"
        >

      </div>

    `;

  });

}

// =====================================
// GUARDAR PRONÓSTICOS
// =====================================

async function enviarPronosticos() {

  const nombre =
    document.getElementById("nombre").value;

  if(nombre === ""){

    alert("Ingresa tu nombre");

    return;
  }

  // Volvemos a leer los partidos

  const { data: partidos } =
    await supabaseClient
      .from('partidos')
      .select('*')
      .eq('visible', true);

  const pronosticos = [];

  partidos.forEach(partido => {

    const predLocal =
      document.getElementById(
        `local_${partido.match_id}`
      ).value;

    const predVisita =
      document.getElementById(
        `visita_${partido.match_id}`
      ).value;

    pronosticos.push({

      usuario: nombre,

      match_id:
        partido.match_id,

      pred_local:
        Number(predLocal),

      pred_visita:
        Number(predVisita)

    });

  });

  console.log(pronosticos);

  const { error } =
    await supabaseClient
      .from('pronosticos')
      .insert(pronosticos);

  if(error){

    console.error(error);

    alert("Error al guardar");

    return;
  }

  alert("Pronósticos guardados");

}

// =====================================
// INICIAR APP
// =====================================

cargarPartidos();