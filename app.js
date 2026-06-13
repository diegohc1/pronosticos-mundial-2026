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
      
        const mensaje =
          error.message || "";
      
        if(
          mensaje.includes("unico_pronostico")
        ){
      
          document
            .getElementById(
              "mensaje"
            )
            .innerHTML =
              "⚠️ Ya registraste un pronóstico para uno o más de esos partidos.";
      
        }else{
      
          document
            .getElementById(
              "mensaje"
            )
            .innerHTML =
              "⚠️ Ocurrió un error al guardar los pronósticos.";
      
        }
      
        return;
      
      }

  const ahora = new Date();
//
 partidosVisibles =
  data.filter(partido => {

    const fecha =
      new Date(
        partido.fecha_hora
      );

    const despues =
      new Date(fecha);

    despues.setHours(
      despues.getHours() + 15
    );

    const hoy =
      new Date();

    const inicioHoy =
      new Date(
        hoy.getFullYear(),
        hoy.getMonth(),
        hoy.getDate()
      );

    const inicioPasadoManana =
      new Date(
        hoy.getFullYear(),
        hoy.getMonth(),
        hoy.getDate() + 2
      );

    return (

      fecha >= inicioHoy &&
      fecha < inicioPasadoManana &&

      ahora <= despues

    );

  });
//

  partidosVisibles.sort(
    (a,b) =>
      new Date(a.fecha_hora)
      -
      new Date(b.fecha_hora)
  );

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

  const ahora =
    new Date();

  let fechaActual = "";

  partidosVisibles.forEach(
    partido => {

      const fecha =
        new Date(
          partido.fecha_hora
        );

      const cerrado =
        ahora >= fecha;

      const fechaGrupo =
        fecha.toLocaleDateString(
          'es-PE',
          {
            weekday:'long',
            day:'numeric',
            month:'long'
          }
        );

      if(
        fechaGrupo !==
        fechaActual
      ){

        fechaActual =
          fechaGrupo;

        div.innerHTML += `

        <h2>

          📅 ${fechaGrupo}

        </h2>

        `;

      }

      const horaTexto =
        fecha.toLocaleTimeString(
          'es-PE',
          {
            hour:'2-digit',
            minute:'2-digit'
          }
        );

      div.innerHTML += `

      <div class="partido">

        <p>

          <strong>

            Grupo
            ${partido.grupo}

          </strong>

        </p>

        <h3>

          ${partido.equipo1}

          vs

          ${partido.equipo2}

        </h3>

        <p>

          🕒 ${horaTexto}

        </p>

        ${
          cerrado

          ?

          `

          <p class="cerrado">

            🔴 Cerrado

          </p>

          `

          :

          `

          <p>

            🟢 Abierto

          </p>

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

const mensajes = [

    "⚽ Pronóstico registrado. El VAR revisará tus decisiones.",
  
    "📊 ¿Crees que saber estadística ayuda a pronosticar fútbol? Hoy lo averiguaremos.",
  
    "📈 Tu modelo mental acaba de generar una predicción. Veremos su ajuste.",
  
    "🎯 Todo modelo es incorrecto, pero algunos pronósticos son útiles.",
  
    "📉 El error estándar de este pronóstico parece preocupante.",
  
    "🔍 Necesitamos un análisis de factores asociados para entender esta apuesta.",
  
    "📊 Correlación no implica causalidad. Que tu equipo gane tampoco.",
  
    "📈 Acabas de generar un dato. La evidencia vendrá después.",
  
    "🧮 Este pronóstico será sometido a validación empírica.",
  
    "📋 El comité metodológico observará atentamente tus decisiones.",
  
    "📊 Si aciertas, fue capacidad predictiva. Si fallas, fue variabilidad aleatoria.",
  
    "😎 Tu reputación futbolística está en juego.",
  
    "😂 Este pronóstico puede envejecer espectacularmente mal.",
  
    "🔥 La valentía de esta apuesta será evaluada próximamente.",
  
    "🤔 Interesante hipótesis. Falta contrastarla con la realidad.",
  
    "⚽ El balón tiene opiniones propias sobre tu pronóstico.",
  
    "🏆 Si aciertas, exigiremos una explicación metodológica.",
  
    "📉 Riesgo de sobreajuste detectado.",
  
    "🎲 El fútbol insiste en comportarse peor que nuestros modelos.",
  
    "📝 Evidencia registrada para futuras conversaciones de pasillo.",
  
    "📚 Este pronóstico será incorporado a la base de evidencias.",
  
    "📊 Se recomienda interpretar este resultado con cautela.",
  
    "🧮 La significancia estadística de esta apuesta está por determinarse.",
  
    "📈 Estamos observando una confianza que excede la evidencia disponible.",
  
    "🔎 Se requieren más datos para justificar este marcador.",
  
    "📋 El equipo técnico tomará nota de esta predicción.",
  
    "📉 Este resultado presenta alta incertidumbre y baja trazabilidad.",
  
    "📊 El intervalo de confianza de esta apuesta es sorprendentemente amplio.",
  
    "📝 La literatura especializada no respalda necesariamente esta decisión.",
  
    "🏆 Si este pronóstico se cumple, habrá que actualizar la teoría.",

    "🏆 Este pronóstico no tiene relación significativa con el rendimiento.",

    "📝 AVISO: El cálculo de este pronóstico ha sido generado sin pesos.",

    "🔎 Este pronóstico se comporta de manera diferente por estrato.",

    "🔎 Recuerda que las predicciones enviadas no forman parte de tu entregable de este mes.",

    "🔎 lavaan WARNING: some estimated ov/lv variances are negative",

    "🔎 lavaan WARNING: covariance matrix of latent variables is not positive definite",

    "🔎 lavaan WARNING: An ultra-Heywood case was detected.",

    "Tu pronóstico ha sido recibido y archivado conforme al procedimiento correspondiente. 📂",
    
    "Se registró la apuesta. El presupuesto emocional corre por tu cuenta. 💰",
    
    "El trámite fue aprobado sin observaciones. ✅",
    
    "No se encontraron inconsistencias administrativas en tu pronóstico. 📋",

    "Se deja constancia de que este expediente fue presentado sin presión externa. ✍️",

    "La unidad orgánica competente revisará su nivel de fe en ese resultado. 📊",

    "Mesa de partes confirma la recepción de su optimismo deportivo. 📥"


  
  ];

// =====================================
// ENVIAR PRONÓSTICOS
// =====================================

async function enviarPronosticos(){

  const nombre =
  document
    .getElementById("nombre")
    .value
    .trim()
    .toUpperCase();

  if(!nombre){

    alert(
      "Ingrese su nombre"
    );

    return;

  }

  const registros = [];

  const ahora =
    new Date();

  partidosVisibles.forEach(
    partido => {

      const fecha =
        new Date(
          partido.fecha_hora
        );

      const cerrado =
        ahora >= fecha;

      if(cerrado){
        return;
      }

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
      .from("pronosticos")
      .insert(
        registros
      );



      if(error){

        console.error(error);
      
        const mensaje =
          error.message || "";
      
        if(
          mensaje.includes("unico_pronostico")
        ){
      
          document
            .getElementById(
              "mensaje"
            )
            .innerHTML =
              "⚠️ Ya registraste un pronóstico para uno o más de esos partidos.";
      
        }else{
      
          document
            .getElementById(
              "mensaje"
            )
            .innerHTML =
              "⚠️ Ocurrió un error al guardar los pronósticos.";
      
        }
      
        return;
      
      }



      const mensajeAleatorio =
      mensajes[
        Math.floor(
          Math.random() *
          mensajes.length
        )
      ];
    
    document
      .getElementById(
        "mensaje"
      )
      .innerHTML =
        `
        <strong>
          ✅ Pronóstico registrado correctamente.
        </strong>
    
        <br><br>
    
        ${mensajeAleatorio}
        `;

}

const frasesBienvenida = [

    "⚽ ¿Listo para el reto?",
  
    "🏆 Hoy todos son expertos en fútbol.",
  
    "📊 Porque saber estadística no garantiza saber de fútbol.",
  
    "🔍 La evidencia disponible para tus pronósticos es limitada.",
  
    "😎 La confianza es gratis. Los puntos no.",
  
    "📈 Tu modelo mental será puesto a prueba.",
  
    "⚽ El Mundial comienza. La reputación está en juego.",
  
    "🎯 ¿Predicción informada o corazonada? Lo sabremos pronto.",
  
    "📉 Recuerda: un tamaño muestral de un partido puede ser engañoso.",
    
    "😂 Este sistema registra goles y futuras vergüenzas.",
  
    "🔥 ¿Cuánto prestigio estadístico estás dispuesto a perder?",
  
    "💸 ¿Cuánto prestigio estás dispuesto a sacrificar por una corazonada?",
  
    "⚽ Se aceptan pronósticos. No se aceptan excusas.",
  
    "🔎 Los factores asociados de tus apuestas serán investigados.",
  
    "😂 Tus compañeros ya están preparando los comentarios post-partido.",
  
    "🏆 Que gane el mejor pronosticador... o el más suertudo."
  
  ];
  
  document
    .getElementById(
      "fraseBienvenida"
    )
    .innerHTML =
      frasesBienvenida[
        Math.floor(
          Math.random() *
          frasesBienvenida.length
        )
      ];

// =====================================
// INICIAR
// =====================================

cargarPartidos();
