/* ════════════════════════════════════════════════════════════════════
   Dr. Wilmer Palacios. Galería de casos.

   Este es el ÚNICO archivo que hay que tocar para agregar casos nuevos.
   Copiar el último bloque, cambiar los datos y listo: la galería, los
   filtros y el contador se actualizan solos.

   Campos:
     id        · identificador corto, sirve para el ancla de la URL.
     titulo    · una línea. Sale del texto del Dr., no se inventa.
     fotos     · nombres de archivo dentro de assets/casos/, EN ORDEN.
                 Cada foto ya trae el antes (izq.) y el después (der.).
     tipo      · 'primaria' | 'secundaria' | null   (null = no lo dice)
     abordaje  · 'abierto'  | 'cerrado'    | null
     injerto   · 'costal'   | 'septal'     | 'sin-injerto' | null
     postop    · texto corto del seguimiento, ej. '7 meses post op'.
     desc      · descripción del Dr., tal cual la publicó (sin hashtags,
                 y traducida al español si la escribió en inglés).
                 Los saltos de línea se respetan como párrafos.

   No hace falta medir las fotos: la galería las muestra dentro de una
   caja 4:3 sin recortarlas, sea cual sea su proporción.

   IMPORTANTE: si un dato no está en la descripción del Dr., va null.
   No se completa "a ojo": el filtro simplemente no muestra ese caso.
   ════════════════════════════════════════════════════════════════════ */

window.CASOS = [
  {
    id: 'caso-01',
    titulo: 'Rinoplastia primaria',
    fotos: ['Caso01a.jpg', 'Caso01b.jpg', 'Caso01c.jpg', 'Caso01d.jpg', 'Caso01e.jpg'],
    tipo: 'primaria', abordaje: null, injerto: null,
    postop: '2 meses post op',
    desc: 'Rinoplastia primaria, fotos pre y postoperatoria, 2 meses post operada. Es muy pronto para ver resultados estéticos definitivos. En este caso ha habido un proceso desinflamatorio importante que me motivó a publicarlo.\nEn su foto de frente vemos una pirámide nasal con una punta bulbosa, la cual estructuralmente se afinó, definiéndola y cambiando así la forma de la base nasal. También vemos asimetría en sus alas nasales, las cuales se corrigen mejorándolas en un porcentaje. En su foto de perfil presenta un dorso alto (giba); al realizar la gibectomía o trabajo del dorso, la piel que lo cubre tiende a perder tensión y se relaja, lo que se refleja con el tiempo en el cierre de la apertura ocular a expensas del párpado inferior, dando una apariencia natural.\nAl sonreír, la paciente expone las encías superiores (sonrisa gingival). Es importante diagnosticarla e informarle a la paciente que puede ser tratada quirúrgicamente por razones funcionales y estéticas; en este caso se le realizó el descenso del labio superior, dando como resultado una sonrisa dental (no en todos los casos se consiguen estos resultados). Este procedimiento, junto a las modificaciones estructurales de la nariz, nos permite conseguir naturalidad y belleza en los resultados.\nLa rinoplastia estructural que hoy día practicamos tiene como objetivos: optimizar la función nasal (respirar bien), crear una apariencia natural acorde a los deseos del paciente, y que los resultados conseguidos perduren en el tiempo.'
  },
  {
    id: 'caso-02',
    titulo: 'Rinoplastia secundaria con injerto costal',
    fotos: ['Caso02a.jpg', 'Caso02b.jpg', 'Caso02c.jpg', 'Caso02d.jpg'],
    tipo: 'secundaria', abordaje: 'abierto', injerto: 'costal',
    postop: '7 meses post op',
    desc: 'Rinoplastia secundaria. Abordaje abierto. Toma de injerto costal. 7 meses post operada.\nEn este caso se buscó crear una apariencia natural acorde a los deseos de la paciente, así como también optimizando su función nasal. En la foto de frente y perfil vemos como resultado la continuidad simétrica de las líneas estéticas ceja-dorso-punta, con rotación caudal de su punta, creando un dorso continuo, reduciendo el ángulo nasolabial y a la vez evitando la exposición exagerada de las narinas. Se buscó la simetría entre los cartílagos lobulares con una punta nasal más definida, triangularizando así su base nasal y consiguiendo mejorar la simetría de sus narinas.\nEl objetivo más importante en toda rinoplastia es proveerle resultados satisfactorios y definitivos a largo plazo a la paciente, así que tendremos que esperar con paciencia un mínimo de 2 años para garantizar sus resultados; a veces hasta por 3 y 4 años seguimos viendo cambios.'
  },
  {
    id: 'caso-03',
    titulo: 'Rinoseptoplastia primaria',
    fotos: ['Caso03a.jpg', 'Caso03b.jpg', 'Caso03c.jpg', 'Caso03d.jpg'],
    tipo: 'primaria', abordaje: null, injerto: null,
    postop: null,
    desc: 'Rinoseptoplastia primaria. Los cambios quirúrgicos que se hicieron en este caso buscaron crear una nariz que armonizara con el rostro, dándole una apariencia natural, aunque los cambios fueron tan sutiles que parece que no hubiese sido operada.'
  },
  {
    id: 'caso-04',
    titulo: 'Rinoseptoplastia · seguimiento al primer año',
    fotos: ['Caso04a.jpg', 'Caso04b.jpg', 'Caso04c.jpg', 'Caso04d.jpg'],
    tipo: null, abordaje: null, injerto: null,
    postop: '1 año post op',
    desc: 'Proveer resultados satisfactorios a largo plazo es uno de los objetivos principales al realizar una rinoseptoplastia, porque la cicatrización de la nariz es muy lenta.\nEsta paciente está en su primer año postoperatorio. Todavía esperamos al segundo año para ver que se complete gran parte de su cicatrización y tomarle nuevas fotos, aunque por 5 o más años podemos seguir viendo cambios fotográficos de la nariz.'
  },
  {
    id: 'caso-05',
    titulo: 'Rinoseptoplastia · seguimiento a 9 meses',
    fotos: ['Caso05a.jpg', 'Caso05b.jpg', 'Caso05c.jpg', 'Caso05d.jpg'],
    tipo: null, abordaje: null, injerto: null,
    postop: '9 meses post op',
    desc: 'Fotos preoperatoria y a los 9 meses postoperatorio, con buena evolución en su cicatrización y definición.\nEl objetivo en toda rinoseptoplastia es proveerle al paciente resultados satisfactorios a largo plazo, y eso solo lo dará el tiempo (entre 2 y 3 años). De ahí la importancia del seguimiento fotográfico. 2023.'
  },
  {
    id: 'caso-06',
    titulo: 'Rinoseptoplastia primaria',
    fotos: ['Caso06a.jpg', 'Caso06b.jpg', 'Caso06c.jpg', 'Caso06d.jpg'],
    tipo: 'primaria', abordaje: null, injerto: null,
    postop: '4 meses post op',
    desc: 'Rinoseptoplastia primaria a sus 4 meses post op.\nAcuérdense de que la nariz cicatriza en un porcentaje alto a los 2 o 3 años, y todavía a los 5 años podemos ver mínimos cambios fotográficos. Por lo tanto siempre hay que esperar, para proveerle resultados definitivos a nuestros pacientes. El seguimiento fotográfico durante ese tiempo es muy importante.'
  },
  {
    id: 'caso-07',
    titulo: 'Rinoseptoplastia',
    fotos: ['Caso07a.jpg', 'Caso07b.jpg', 'Caso07c.jpg', 'Caso07d.jpg'],
    tipo: null, abordaje: null, injerto: null,
    postop: null,
    desc: 'Los objetivos principales de una rinoseptoplastia son:\n1 · Optimizar la función nasal.\n2 · Crear una apariencia natural acorde a los deseos del paciente y a lo que uno sugiera que ayude en su armonía facial.\n3 · Proveer resultados satisfactorios a largo plazo, ya que la nariz cicatriza muy lentamente. Para ello, el seguimiento fotográfico por más de 3 años es muy importante.'
  },
  {
    id: 'caso-08',
    titulo: 'Rinoplastia primaria estructural',
    fotos: ['Caso08a.jpg', 'Caso08b.jpg', 'Caso08c.jpg', 'Caso08d.jpg'],
    tipo: 'primaria', abordaje: null, injerto: null,
    postop: '3 años post op',
    desc: 'Rinoplastia primaria estructural. Antes y después, 3 años postoperatorio.'
  },
  {
    id: 'caso-09',
    titulo: 'Rinoseptoplastia primaria por abordaje externo',
    fotos: ['Caso09a.jpg', 'Caso09b.jpg', 'Caso09c.jpg', 'Caso09d.jpg'],
    tipo: 'primaria', abordaje: 'abierto', injerto: null,
    postop: '2 años post op',
    desc: 'Rinoseptoplastia primaria por abordaje externo, 2 años post op.\nLlevar un registro fotográfico de nuestros pacientes antes de la cirugía y después, en las diferentes proyecciones (frente, perfil, 3/4 o perfil selfie y base), es importante para ver la evolución de nuestro trabajo por mínimo 2 años. Así podremos saber nuestros verdaderos resultados y poder corregir detalles de ser necesario, lo que nos permite proveerle resultados satisfactorios a largo plazo.\nVer resultados inmediatos después de la cirugía nos dice un porcentaje de cómo quedó la cirugía, pero el verdadero resultado lo dará el tiempo.'
  },
  {
    id: 'caso-10',
    titulo: 'Resultado natural',
    fotos: ['Caso10a.jpg', 'Caso10b.jpg', 'Caso10c.jpg', 'Caso10d.jpg'],
    tipo: null, abordaje: null, injerto: null,
    postop: 'Septiembre 2024',
    desc: 'Resultado natural.'
  },
  {
    id: 'caso-11',
    titulo: 'Rinoseptoplastia primaria ultrasónica',
    fotos: ['Caso11a.jpg', 'Caso11b.jpg', 'Caso11c.jpg', 'Caso11d.jpg'],
    tipo: 'primaria', abordaje: null, injerto: null,
    postop: '2024',
    desc: 'Rinoseptoplastia primaria ultrasónica. Servicio de Otorrinolaringología, Centro Médico Docente La Trinidad, Caracas, 2024.'
  },
  {
    id: 'caso-12',
    titulo: 'Rinoseptoplastia secundaria',
    fotos: ['Caso12a.jpg', 'Caso12b.jpg', 'Caso12c.jpg'],
    tipo: 'secundaria', abordaje: null, injerto: null,
    postop: '2 años post op',
    desc: 'Rinoseptoplastia secundaria, 2 años post op.\nBuscar resultados naturales en narices ya operadas, donde las estructuras ya fueron modificadas, es el objetivo que deseamos conseguir, y que se mantengan en el tiempo hasta que termine la cicatrización.'
  },
  {
    id: 'caso-13',
    titulo: 'Rinoseptoplastia primaria',
    fotos: ['Caso13a.jpg', 'Caso13b.jpg', 'Caso13c.jpg', 'Caso13d.jpg'],
    tipo: 'primaria', abordaje: null, injerto: null,
    postop: '2 años post op',
    desc: 'Rinoseptoplastia primaria, 2 años post op.\nLos cambios que vemos desde las diferentes proyecciones: empezando desde la base nasal, donde buscamos esa triangularidad de la punta nasal cuando la nariz es de forma bulbosa (siempre que el grosor de la piel lo permita); un perfil recto donde la punta le gane al dorso en altura, dándole naturalidad; una foto de tres cuartos (perfil social) donde la línea ceja, dorso y punta presenta una continuidad suave y delicada; y en la proyección de frente vemos cómo se afinó la punta.\nLo que se busca al realizar este tipo de cirugía es proveer resultados satisfactorios a largo plazo en las diferentes proyecciones fotográficas. La espera de dos años como mínimo es importante para tomar dichas fotos y ver resultados definitivos.'
  },
  {
    id: 'caso-14',
    titulo: 'Rinoseptoplastia primaria con técnica Let Down',
    fotos: ['Caso14a.jpg', 'Caso14b.jpg', 'Caso14c.jpg', 'Caso14d.jpg'],
    tipo: 'primaria', abordaje: 'cerrado', injerto: null,
    postop: '2 años post op',
    desc: 'Rinoseptoplastia primaria, 2 años post op. Se realizó un abordaje cerrado y se practicó la técnica de Let Down, con el fin de hacer un descenso del dorso nasal dejando un dorso recto normal masculino, ampliando las fosas nasales en sentido lateral, permitiendo la corrección del septum nasal y la apertura de las válvulas nasales internas. La piel de los párpados inferiores regresa relajadamente, permitiendo el cierre del párpado inferior: como pueden apreciar, los ojos ya tienen un aspecto más normal.\nEstos son los casos donde lo funcional es estético. Aunque al paciente solo le interesaba una buena respiración nasal, el cambio estético debía realizarse para dicho fin. La respiración es nasal, no bucal.\nCon el tiempo el paciente puede experimentar una mejora en el avance del mentón, al volver a tener una deglución típica o normal. Por eso sugiero, antes de hacerle una mentoplastia de avance, dejar unos dos años de observación, y más aún si son personas jóvenes.'
  },
  {
    id: 'caso-15',
    titulo: 'Rinoseptoplastia primaria en nariz torcida',
    fotos: ['Caso15a.jpg', 'Caso15b.jpg', 'Caso15c.jpg', 'Caso15d.jpg'],
    tipo: 'primaria', abordaje: null, injerto: null,
    postop: '2 años post op',
    desc: 'Rinoseptoplastia primaria. La nariz torcida es el gran reto para cualquier cirujano de nariz: lograr, con las diferentes técnicas quirúrgicas, alinear la pirámide nasal y que esos resultados perduren en el tiempo. 2 años post op.'
  },
  {
    id: 'caso-16',
    titulo: 'Rinoseptoplastia primaria',
    fotos: ['Caso16a.jpg', 'Caso16b.jpg', 'Caso16c.jpg', 'Caso16d.jpg'],
    tipo: 'primaria', abordaje: null, injerto: null,
    postop: '2 años post op',
    desc: 'Rinoseptoplastia primaria, 2 años post op, creando un resultado satisfactorio a largo plazo.'
  },
  {
    id: 'caso-17',
    titulo: 'Rinoseptoplastia',
    fotos: ['Caso17a.jpg', 'Caso17b.jpg', 'Caso17c.jpg', 'Caso17d.jpg', 'Caso17e.jpg'],
    tipo: null, abordaje: null, injerto: null,
    postop: null,
    desc: 'Yo siempre busco, al realizar una rinoseptoplastia, tres objetivos:\n1 · Optimizar la función nasal.\n2 · Buscar resultados estéticos acorde a los deseos del paciente y a lo que el cirujano sugiera.\n3 · Proveer resultados satisfactorios a largo plazo (mínimo a 2 años).'
  },
  {
    id: 'caso-18',
    titulo: 'Rinoseptoplastia primaria y mentoplastia',
    fotos: ['Caso18a.jpg', 'Caso18b.jpg'],
    tipo: 'primaria', abordaje: null, injerto: null,
    postop: null,
    desc: 'Rinoseptoplastia primaria y mentoplastia, buscando armonía en los tercios faciales. Trabajo en equipo.'
  },
  {
    id: 'caso-19',
    titulo: 'Rinoseptoplastia secundaria',
    fotos: ['Caso19a.jpg', 'Caso19b.jpg', 'Caso19c.jpg', 'Caso19d.jpg'],
    tipo: 'secundaria', abordaje: null, injerto: null,
    postop: '4 años post op',
    desc: 'Rinoseptoplastia secundaria, 4 años post op, buscando naturalidad en el resultado a largo plazo.'
  },
  {
    id: 'caso-20',
    titulo: 'Rinoseptoplastia secundaria con injerto costal',
    fotos: ['Caso20a.jpg', 'Caso20b.jpg', 'Caso20c.jpg', 'Caso20d.jpg'],
    tipo: 'secundaria', abordaje: 'abierto', injerto: 'costal',
    postop: '2 años post op',
    desc: 'Rinoseptoplastia secundaria. Reconstrucción con injerto costal por abordaje externo, optimizando su función nasal, creando una apariencia natural y proveyendo resultados satisfactorios a largo plazo. Estos son mis objetivos cada vez que realizo una cirugía nasal. Foto a los 2 años post op.'
  },
  {
    id: 'caso-21',
    titulo: 'Rinoseptoplastia con descenso de la punta nasal',
    fotos: ['Caso21a.jpg', 'Caso21b.jpg', 'Caso21c.jpg', 'Caso21d.jpg'],
    tipo: null, abordaje: null, injerto: null,
    postop: '3 años post op',
    desc: 'Rinoseptoplastia, 3 años post op. Existen varias técnicas para disminuir la proyección de la punta nasal. En este caso en particular descendí las cruras mediales y las suturé a la espina nasal del maxilar, dándole una forma natural a la base.'
  }
];
