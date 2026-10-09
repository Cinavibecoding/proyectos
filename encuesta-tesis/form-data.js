// Estructura del Google Form. Los textos de las OPCIONES deben ser idénticos a los del Form,
// porque Google rechaza respuestas cuyo texto no coincide exactamente.
window.FORM = {
  action: "https://docs.google.com/forms/d/e/1FAIpQLSd-o-FnPxguZPNEHeMZ3EZNDPvFcmjYnLOmUpjAwf4SI0Y_Xg/formResponse",
  pageHistory: "0,1,2,3",
  title: "Depresión en pacientes con enfermedades cardíacas: influencia del estrés percibido, apoyo social, sexo, edad y tiempo con el diagnóstico",
  intro: "¡Hola!\n\nSomos Victor Rojas y Hani Kasabji, estudiantes de la Universidad Metropolitana y estamos llevando a cabo una investigación para nuestro Trabajo de Grado en Psicología titulado \"Depresión en pacientes con enfermedades cardíacas: influencia del estrés percibido, apoyo social, sexo, edad y tiempo con el diagnóstico\", Tesis que esta siendo realizada bajo la tutoría de la Licenciada Guadalupe Pérez.\n\nEn el formulario encontrarás diversas preguntas que nos ayudarán a saber cómo se relacionan las variables que estamos evaluando, el tiempo de respuesta es aproximadamente 20 minutos.\n\n¡Agradecemos mucho su participación!",
  thanks: "Se ha registrado tu respuesta, Muchas gracias por haber participado.",
  consent: {
    entry: "286373568",
    text: "Declaro que estoy de acuerdo en participar en esta investigación de manera voluntaria y que puedo abandonarlo en cualquier momento. Entiendo que mis datos serán utilizados para fines de investigación y los mismos permanecerán anónimos, además, mis respuestas serán tratadas de forma confidencial, de acuerdo con lo establecido en los artículos 55, 57 y 60 del Código de Ética Profesional del Psicólogo",
    yes: "Acepto dar mi consentimiento para la investigación",
    no: "No Acepto dar mi consentimiento para la investigación"
  },
  sections: [
    {
      id: "demo", title: "Datos generales", instructions: "",
      items: [
        { key: "sexo", entry: "1583913644", q: "Sexo", type: "choice", options: ["Femenino", "Masculino"] },
        { key: "edad", entry: "2032496543", q: "Edad (En número)", type: "number", min: 18, max: 110 },
        { key: "tiempo", entry: "1018884691", q: "Tiempo transcurrido con el diagnóstico de enfermedad cardíaca", type: "choice",
          options: ["Menos de un año", "Entre uno y dos años", "Entre dos y cuatro años", "Más de cuatro años"] },
        { key: "laboral", entry: "979871757", q: "Condición / Situación laboral actual", type: "choice", other: true,
          options: ["Empleado activo (tiempo completo o parcial)", "Trabajador independiente / Cuenta propia", "Desempleado", "Jubilado / Pensionado", "Labores del hogar / Ama de casa"] }
      ]
    },
    {
      id: "apoyo", title: "Cuestionario de apoyo social autopercibido",
      instructions: "A continuación se te presentarán una serie de enunciados relacionados con la percepción del apoyo social en su propia experiencia. Por favor, lea con detenimiento y seleccione la respuesta que más se aplique a su caso.",
      scale: ["Nada", "Muy poco", "Regular", "Mucho"],
      rows: [
        ["360593816", "Tengo amigos que me apoyan sin importar lo que esté haciendo o cómo me siento"],
        ["1498099960", "Cuando tengo el apoyo de mi familia me siento más preocupado con lo que estoy haciendo"],
        ["450564605", "Pienso que la gente no necesita a otros y que uno puede solucionar las cosas uno mismo"],
        ["720028074", "Puedo contar con los compañeros que viven cerca de mí para que me ayuden cuando me siento preocupado"],
        ["1809650404", "Recibo o recibí apoyo por parte de mis padres"],
        ["1168295868", "Soy miembro de un grupo social (religioso, clubes, equipos, etc)"],
        ["1767372794", "Pido el apoyo de los otros"],
        ["793573953", "Aunque me siento muy mal, mis amigos me hacen sentir alegre e importante"],
        ["899643855", "Tengo en quien confiar"],
        ["2063172286", "Mi familia me proporciona satisfacciones y un sentimiento de fortaleza"],
        ["1235535368", "Las personas deberían poder contar con orientación religiosa para obtener apoyo y tranquilidad"],
        ["1902376599", "Creo en mí mismo y en la habilidad para manejar situaciones nuevas sin la ayuda de otros"],
        ["1439696754", "Cuando me siento infeliz o bajo estrés hay gente alrededor a quien recurrir"],
        ["414904801", "Mi relación con mis compañeros me hace sentir bien"],
        ["1402225782", "Durante mi crecimiento siempre había gente a mi alrededor a quien recurrir cuando lo necesitaba"],
        ["1921049982", "Comparto actividades religiosas con mis compañeros"],
        ["78923465", "Para mí es importante contar con el apoyo emocional de la comunidad religiosa a la cual pertenezco"],
        ["995563982", "Me siento bien cuando le pido apoyo a mi familia"],
        ["983150980", "Para mí es importante contar con el apoyo emocional de mis amigos"],
        ["1321147583", "Siento que los que están cerca de mí me hacen sentir importante"],
        ["2081832004", "Puedo recurrir a mis padres cuando tengo un problema"],
        ["396105869", "Me siento solo como si no tuviera a nadie cerca"],
        ["112253814", "Los compañeros que estén cerca de mí me hacen sentir que hay alguien que se preocupa por mí"],
        ["535837910", "Tengo amigos que me apoyarán no importa lo que haga"],
        ["1007500313", "Mis hermanos me brindan apoyo"],
        ["1834740609", "Mis profesores/jefes me ayudan cuando lo necesito"],
        ["1618006149", "Cuando tengo problemas me los guardo para mí"],
        ["808889455", "En mi organización prefiero trabajar en equipo"]
      ]
    },
    {
      id: "pss", title: "Escala de estrés percibido (PSS-14)",
      instructions: "Marca la opción que mejor se adecúe a tu situación actual, teniendo en cuenta el último mes.",
      scale: ["Nunca 0", "Casi Nunca 1", "De vez en cuando 2", "Amenudo 3", "Muy Amenudo 4"],
      rows: [
        ["1894047648", "¿Con qué frecuencia has estado afectado/a por algo que ha ocurrido inesperadamente?"],
        ["993708337", "¿Con qué frecuencia te has sentido incapaz de controlar las cosas importantes de tu vida?"],
        ["287974034", "¿Con qué frecuencia te has sentido nervioso/a o estresado/a (lleno/a de tensión)?"],
        ["264319584", "¿Con qué frecuencia has manejado con éxito los pequeños problemas irritantes de la vida?"],
        ["1865804370", "¿Con qué frecuencia has sentido que hayas enfrentado efectivamente los cambios importantes que han estado ocurriendo en tu vida?"],
        ["1973396746", "¿Con qué frecuencia has estado seguro/a sobre tu capacidad de manejar tus problemas personales?"],
        ["55003553", "¿Con qué frecuencia has sentido que las cosas te salen bien?"],
        ["329948070", "¿Con qué frecuencia has sentido que no podías enfrentar todas las cosas que tenías que hacer?"],
        ["1197007363", "¿Con qué frecuencia has podido controlar las dificultades de tu vida?"],
        ["1302222687", "¿Con qué frecuencia has sentido que tienes el control de todo?"],
        ["850346693", "¿Con qué frecuencia has estado enojado/a porque las cosas que te han ocurrido estaban fuera de tu control?"],
        ["482196962", "¿Con qué frecuencia has pensado sobre las cosas que no has terminado (pendientes de hacer)?"],
        ["1322374489", "¿Con qué frecuencia has podido controlar la forma de pasar el tiempo (organizar)?"],
        ["466599904", "¿Con qué frecuencia has sentido que las dificultades se acumulan tanto que no puedes superarlas?"]
      ]
    },
    {
      id: "bdi", title: "Inventario de depresión de Beck (BDI-II)",
      instructions: "Este cuestionario consta de 21 grupos de afirmaciones. Por favor, lea con atención cada uno de ellos cuidadosamente. Luego elija uno de cada grupo, el que mejor describa el modo como se ha sentido las últimas dos semanas, incluyendo el día de hoy. Si varios enunciados de un mismo grupo le parecen igualmente apropiados, elija el número más alto.",
      items: [
        { entry: "755485676", q: "1. Tristeza", options: ["0 No me siento triste.", "1 Me siento triste gran parte del tiempo.", "2 Me siento triste todo el tiempo.", "3 Me siento tan triste o soy tan infeliz que no puedo soportarlo."] },
        { entry: "990956698", q: "2. Pesimismo", options: ["0 No estoy desalentado respecto del mi futuro.", "1 Me siento más desalentado respecto de mi futuro que lo que solía estarlo.", "2 No espero que las cosas funcionen para mi", "3 Siento que no hay esperanza para mi futuro y que sólo puede empeorar"] },
        { entry: "1699898415", q: "3. Fracaso", options: ["0 No me siento como un fracasado.", "1 He fracasado más de lo que hubiera debido.", "2 Cuando miro hacia atrás, veo muchos fracasos.", "3 Siento que como persona soy un fracaso total."] },
        { entry: "838789238", q: "4. Pérdida de Placer", options: ["0 Obtengo tanto placer como siempre por las cosas de las que disfruto.", "1 No disfruto tanto de las cosas como solía hacerlo.", "2 Obtengo muy poco placer de las cosas que solía disfrutar.", "3 No puedo obtener ningún placer de las cosas de las que solía disfrutar."] },
        { entry: "1922226521", q: "5. Sentimientos de Culpa", options: ["0 No me siento particularmente culpable.", "1 Me siento culpable respecto de varias cosas que he hecho o que debería haber hecho.", "2 Me siento bastante culpable la mayor parte del tiempo.", "3 Me siento culpable todo el tiempo."] },
        { entry: "1341202305", q: "6. Sentimientos de Castigo", options: ["0 No siento que este siendo castigado", "1 Siento que tal vez pueda ser castigado.", "2 Espero ser castigado.", "3 Siento que estoy siendo castigado"] },
        { entry: "280217328", q: "7. Disconformidad con uno mismo", options: ["0 Siento acerca de mi lo mismo que siempre.", "1 He perdido la confianza en mí mismo.", "2 Estoy decepcionado conmigo mismo.", "3 No me gusto a mí mismo."] },
        { entry: "1198885726", q: "8. Autocrítica", options: ["0 No me critico ni me culpo más de lo habitual", "1 Estoy más crítico conmigo mismo de lo que solía estarlo", "2 Me critico a mí mismo por todos mis errores", "3 Me culpo a mí mismo por todo lo malo que sucede."] },
        { entry: "291118202", q: "9. Pensamientos o Deseos Suicidas", risk: true, options: ["0 No tengo ningún pensamiento de matarme.", "1 He tenido pensamientos de matarme, pero no lo haría", "2 Querría matarme", "3 Me mataría si tuviera la oportunidad de hacerlo."] },
        { entry: "1539945594", q: "10. Llanto", options: ["0 No lloro más de lo que solía hacerlo.", "1 Lloro más de lo que solía hacerlo.", "2 Lloro por cualquier pequeñez.", "3 Siento ganas de llorar pero no puedo"] },
        { entry: "333511015", q: "11. Agitación", options: ["0 No estoy más inquieto o tenso que lo habitual.", "1 Me siento más inquieto o tenso que lo habitual.", "2 Estoy tan inquieto o agitado que me es difícil quedarme quieto", "3 Estoy tan inquieto o agitado que tengo que estar siempre en movimiento o haciendo algo"] },
        { entry: "1639360552", q: "12. Pérdida de Interés", options: ["0 No he perdido el interés en otras actividades o personas.", "1 Estoy menos interesado que antes en otras personas o cosas.", "2 He perdido casi todo el interés en otras personas o cosas.", "3.Me es difícil interesarme por algo."] },
        { entry: "1544277149", q: "13. Indecisión", options: ["0 Tomo mis propias decisiones tan bien como siempre.", "1 Me resulta más difícil que de costumbre tomar decisiones.", "2 Encuentro mucha más dificultad que antes para tomar decisiones.", "3 Tengo problemas para tomar cualquier decisión."] },
        { entry: "343524126", q: "14. Desvalorización", options: ["0 No siento que yo no sea valioso.", "1 No me considero a mi mismo tan valioso y útil como solía considerarme.", "2 Me siento menos valioso cuando me comparo con otros.", "3 Siento que no valgo nada."] },
        { entry: "340666223", q: "15. Pérdida de Energía", options: ["0 Tengo tanta energía como siempre.", "1. Tengo menos energía que la que solía tener.", "2. No tengo suficiente energía para hacer demasiado.", "3. No tengo energía suficiente para hacer nada."] },
        { entry: "681874944", q: "16. Cambios en los Hábitos de Sueño", options: ["0 No he experimentado ningún cambio en mis hábitos de sueño.", "1a. Duermo un poco más que lo habitual.", "1b. Duermo un poco menos que lo habitual.", "2a Duermo mucho más que lo habitual.", "2b. Duermo mucho menos que lo habitual.", "3a. Duermo la mayor parte del día.", "3b. Me despierto 1-2 horas más temprano y no puedo volver a dormirme."] },
        { entry: "696411168", q: "17. Irritabilidad", options: ["0 No estoy tan irritable que lo habitual.", "1 Estoy más irritable que lo habitual.", "2 Estoy mucho más irritable que lo habitual.", "3 Estoy irritable todo el tiempo."] },
        { entry: "1472001533", q: "18. Cambios en el Apetito", options: ["0 No he experimentado ningún cambio en mi apetito.", "1a. Mi apetito es un poco menor que lo habitual.", "1b. Mi apetito es un poco mayor que lo habitual.", "2a. Mi apetito es mucho menor que antes.", "2b. Mi apetito es mucho mayor que lo habitual.", "3a . No tengo apetito en absoluto.", "3b. Quiero comer todo el día."] },
        { entry: "152108541", q: "19. Dificultad de Concentración", options: ["0 Puedo concentrarme tan bien como siempre.", "1 No puedo concentrarme tan bien como habitualmente", "2 Me es difícil mantener la mente en algo por mucho tiempo", "3 Encuentro que no puedo concentrarme en nada."] },
        { entry: "1007100102", q: "20. Cansancio o Fatiga", options: ["0 No estoy más cansado o fatigado que lo habitual.", "1 Me fatigo o me canso más fácilmente que lo habitual.", "2 Estoy demasiado fatigado o cansado para hacer muchas de las cosas que solía hacer", "3 Estoy demasiado fatigado o cansado para hacer la mayoría de las cosas que solía"] },
        { entry: "1237165132", q: "21. Pérdida de Interés en el Sexo", options: ["0 No he notado ningún cambio reciente en mi interés por el sexo.", "1 Estoy menos interesado en el sexo de lo que solía estarlo.", "2 Estoy mucho menos interesado en el sexo.", "3 He perdido completamente el interés en el sexo."] }
      ]
    }
  ]
};
