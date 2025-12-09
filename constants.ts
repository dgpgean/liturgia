
import { EucharisticPrayer } from './types';

export const PRAYERS_DATA: EucharisticPrayer[] = [
  {
    id: 'euc-2',
    title: 'Oração Eucarística II',
    type: 'prayer',
    content: `
      <div class="mb-6 italic text-slate-500 text-sm">Prefácio próprio. É a mais indicada para os dias de semana.</div>
      
      <div class="mb-4">
        <div class="mb-1"><strong>V. O Senhor esteja convosco.</strong></div>
        <div class="mb-1">R. Ele está no meio de nós.</div>
      </div>
      <div class="mb-4">
        <div class="mb-1"><strong>V. Corações ao alto.</strong></div>
        <div class="mb-1">R. O nosso coração está em Deus.</div>
      </div>
      <div class="mb-6">
        <div class="mb-1"><strong>V. Demos graças ao Senhor, nosso Deus.</strong></div>
        <div class="mb-1">R. É nosso dever e nossa salvação.</div>
      </div>
      
      <div class="mb-6">
        <strong>Na verdade, é justo e necessário, é nosso dever e salvação dar-vos graças, sempre e em todo o lugar, Senhor, Pai santo, por vosso amado Filho, Jesus Cristo.</strong>
      </div>
      <div class="mb-6">
        <strong>Ele é a vossa Palavra, pela qual tudo criastes. Ele é o nosso Salvador e Redentor, que se encarnou pelo Espírito Santo e nasceu da Virgem Maria. Ele, para cumprir a vossa vontade e adquirir para vós um povo santo, estendeu os braços na hora da paixão, a fim de vencer a morte e manifestar a ressurreição.</strong>
      </div>
      <div class="mb-6">
        <strong>Por isso, com os Anjos e todos os Santos, proclamamos a vossa glória, cantando (dizendo) a uma só voz:</strong>
      </div>
      
      <div class="mb-6 font-semibold text-center bg-slate-50 p-4 rounded-lg">
        Santo, Santo, Santo, Senhor, Deus do universo. O céu e a terra proclamam a vossa glória. Hosana nas alturas. Bendito o que vem em nome do Senhor. Hosana nas alturas.
      </div>
      
      <div class="mb-4">
        <strong>Na verdade, ó Pai, vós sois santo e fonte de toda santidade. Santificai, pois, estas oferendas, derramando sobre elas o vosso Espírito, a fim de que se tornem para nós o Corpo e <span class="text-red-600">+</span> o Sangue de Jesus Cristo, vosso Filho e Senhor nosso.</strong>
      </div>
      <div class="mb-6 text-sm font-bold text-slate-600">R. Santificai e reuni o vosso povo!</div>
      
      <div class="mb-6">
        <strong>Estando para ser entregue e abraçando livremente a paixão, ele tomou o pão, deu graças, e o partiu e deu a seus discípulos, dizendo:</strong>
      </div>
      
      <div class="mb-6 text-red-700 font-bold text-center text-lg border-l-4 border-red-200 pl-4 py-2">
        TOMAI, TODOS, E COMEI:<br/>ISTO É O MEU CORPO,<br/>QUE SERÁ ENTREGUE POR VÓS.
      </div>
      
      <div class="mb-6">
        <strong>Do mesmo modo, ao fim da ceia, ele tomou o cálice em suas mãos, deu graças novamente, e o deu a seus discípulos, dizendo:</strong>
      </div>
      
      <div class="mb-6 text-red-700 font-bold text-center text-lg border-l-4 border-red-200 pl-4 py-2">
        TOMAI, TODOS, E BEBEI:<br/>ESTE É O CÁLICE DO MEU SANGUE,<br/>O SANGUE DA NOVA E ETERNA ALIANÇA,<br/>QUE SERÁ DERRAMADO POR VÓS E POR TODOS<br/>PARA REMISSÃO DOS PECADOS.<br/>FAZEI ISTO EM MEMÓRIA DE MIM.
      </div>
      
      <div class="mb-2"><strong>Eis o mistério da fé!</strong></div>
      <div class="mb-6 text-sm font-bold text-slate-600">R. Anunciamos, Senhor, a vossa morte e proclamamos a vossa ressurreição. Vinde, Senhor Jesus!</div>
      
      <div class="mb-4">
        <strong>Celebrando, pois, a memória da morte e ressurreição do vosso Filho, nós vos oferecemos, ó Pai, o pão da vida e o cálice da salvação; e vos agradecemos porque nos tornastes dignos de estar aqui na vossa presença e vos servir.</strong>
      </div>
      <div class="mb-6 text-sm font-bold text-slate-600">R. Recebei, ó Senhor, a nossa oferta!</div>
      
      <div class="mb-4">
        <strong>E nós vos suplicamos que, participando do Corpo e Sangue de Cristo, sejamos reunidos pelo Espírito Santo num só corpo.</strong>
      </div>
      <div class="mb-6 text-sm font-bold text-slate-600">R. Fazei de nós um só corpo e um só espírito!</div>
      
      <div class="mb-4">
        <strong>Lembrai-vos, ó Pai, da vossa Igreja que se faz presente pelo mundo inteiro: que ela cresça na caridade, com o Papa N., com o nosso Bispo N. e todos os ministros do vosso povo.</strong>
      </div>
      <div class="mb-6 text-sm font-bold text-slate-600">R. Lembrai-vos, ó Pai, da vossa Igreja!</div>
      
      <div class="mb-4">
        <strong>Lembrai-vos também dos nossos irmãos e irmãs que morreram na esperança da ressurreição e de todos os que partiram desta vida: acolhei-os junto a vós na luz da vossa face.</strong>
      </div>
      <div class="mb-6 text-sm font-bold text-slate-600">R. Lembrai-vos, ó Pai, dos vossos filhos!</div>
      
      <div class="mb-4">
        <strong>Enfim, nós vos pedimos, tende piedade de todos nós e dai-nos participar da vida eterna, com a Virgem Maria, Mãe de Deus, com São José, seu esposo, com os santos Apóstolos e todos os que neste mundo vos serviram, a fim de que vos louvemos e glorifiquemos por Jesus Cristo, vosso Filho.</strong>
      </div>
      <div class="mb-6 text-sm font-bold text-slate-600">R. Concedei-nos o convívio dos eleitos!</div>
      
      <div class="mb-4">
        <strong>Por Cristo, com Cristo, em Cristo, a vós, Deus Pai todo-poderoso, na unidade do Espírito Santo, toda a honra e toda a glória, agora e para sempre.</strong>
      </div>
      <div class="mb-6 text-center font-bold text-xl text-amber-600">R. AMÉM.</div>
    `
  },
  {
    id: 'euc-3',
    title: 'Oração Eucarística III',
    type: 'prayer',
    content: `
      <div class="mb-6 italic text-slate-500 text-sm">Prefácio à escolha. Indicada para domingos e festas.</div>

      <div class="mb-4">
        <div class="mb-1"><strong>V. O Senhor esteja convosco.</strong></div>
        <div class="mb-1">R. Ele está no meio de nós.</div>
      </div>
      <div class="mb-4">
        <div class="mb-1"><strong>V. Corações ao alto.</strong></div>
        <div class="mb-1">R. O nosso coração está em Deus.</div>
      </div>
      <div class="mb-6">
        <div class="mb-1"><strong>V. Demos graças ao Senhor, nosso Deus.</strong></div>
        <div class="mb-1">R. É nosso dever e nossa salvação.</div>
      </div>
      
      <div class="mb-6">
        <strong>Na verdade, vós sois santo, ó Deus do universo, e tudo o que criastes proclama o vosso louvor, porque, por Jesus Cristo, vosso Filho e Senhor nosso, e pela força do Espírito Santo, dais vida e santidade a todas as coisas e não cessais de reunir o vosso povo, para que vos ofereça em toda parte, do nascer ao pôr-do-sol, um sacrifício perfeito.</strong>
      </div>
      
      <div class="mb-4">
        <strong>Por isso, nós vos suplicamos: santificai pelo Espírito Santo as oferendas que vos apresentamos para serem consagradas, a fim de que se tornem o Corpo e <span class="text-red-600">+</span> o Sangue de Jesus Cristo, vosso Filho e Senhor nosso, que nos mandou celebrar este mistério.</strong>
      </div>
      <div class="mb-6 text-sm font-bold text-slate-600">R. Enviai o vosso Espírito Santo!</div>
      
      <div class="mb-6">
        <strong>Na noite em que ia ser entregue, ele tomou o pão, deu graças, e o partiu e deu a seus discípulos, dizendo:</strong>
      </div>
      
      <div class="mb-6 text-red-700 font-bold text-center text-lg border-l-4 border-red-200 pl-4 py-2">
        TOMAI, TODOS, E COMEI:<br/>ISTO É O MEU CORPO,<br/>QUE SERÁ ENTREGUE POR VÓS.
      </div>
      
      <div class="mb-6">
        <strong>Do mesmo modo, ao fim da ceia, ele tomou o cálice em suas mãos, deu graças novamente, e o deu a seus discípulos, dizendo:</strong>
      </div>
      
      <div class="mb-6 text-red-700 font-bold text-center text-lg border-l-4 border-red-200 pl-4 py-2">
        TOMAI, TODOS, E BEBEI:<br/>ESTE É O CÁLICE DO MEU SANGUE,<br/>O SANGUE DA NOVA E ETERNA ALIANÇA,<br/>QUE SERÁ DERRAMADO POR VÓS E POR TODOS<br/>PARA REMISSÃO DOS PECADOS.<br/>FAZEI ISTO EM MEMÓRIA DE MIM.
      </div>
      
      <div class="mb-2"><strong>Eis o mistério da fé!</strong></div>
      <div class="mb-6 text-sm font-bold text-slate-600">R. Anunciamos, Senhor, a vossa morte e proclamamos a vossa ressurreição. Vinde, Senhor Jesus!</div>
      
      <div class="mb-4">
        <strong>Celebrando agora, ó Pai, a memória da paixão salvadora do vosso Filho, da sua gloriosa ressurreição e da sua ascensão ao céu, e enquanto esperamos a sua nova vinda, nós vos oferecemos em ação de graças este sacrifício vivo e santo.</strong>
      </div>
      <div class="mb-6 text-sm font-bold text-slate-600">R. Recebei, ó Senhor, a nossa oferta!</div>
      
      <div class="mb-4">
        <strong>Olhai com bondade a oblação da vossa Igreja, reconhecei o Sacrifício que nos reconciliou convosco e concedei que, alimentando-nos com o Corpo e o Sangue do vosso Filho, sejamos repletos do Espírito Santo e nos tornemos em Cristo um só corpo e um só espírito.</strong>
      </div>
      <div class="mb-6 text-sm font-bold text-slate-600">R. Fazei de nós um só corpo e um só espírito!</div>
      
      <div class="mb-4">
        <strong>Que ele faça de nós uma oferenda perfeita para alcançarmos a vida eterna com os vossos eleitos: a Virgem Maria, Mãe de Deus, São José, seu esposo, os vossos santos Apóstolos e gloriosos Mártires, (o Santo do dia ou padroeiro) e todos os Santos, que não cessam de interceder por nós junto a vós.</strong>
      </div>
      <div class="mb-6 text-sm font-bold text-slate-600">R. Fazei de nós uma oferenda perfeita!</div>
      
      <div class="mb-4">
        <strong>Nós vos suplicamos, Senhor, que este sacrifício da nossa reconciliação estenda a paz e a salvação ao mundo inteiro. Confirmai na fé e na caridade a vossa Igreja, enquanto caminha neste mundo: o vosso servo o Papa N., o nosso Bispo N., com os bispos do mundo inteiro, o clero e todo o povo que conquistastes.</strong>
      </div>
      <div class="mb-6 text-sm font-bold text-slate-600">R. Lembrai-vos, ó Pai, da vossa Igreja!</div>
      
      <div class="mb-4">
        <strong>Atendei às preces da vossa família, que está aqui, na vossa presença. Reuni em vós, Pai de misericórdia, todos os vossos filhos e filhas dispersos pelo mundo inteiro.</strong>
      </div>
      <div class="mb-6 text-sm font-bold text-slate-600">R. Lembrai-vos, ó Pai, dos vossos filhos!</div>
      
      <div class="mb-4">
        <strong>Acolhei com bondade no vosso reino os nossos irmãos e irmãs que partiram desta vida e todos os que morreram na vossa amizade. Lá esperamos gozar plenamente da vossa glória, por Cristo, Senhor nosso, por quem dais ao mundo todo bem e toda graça.</strong>
      </div>
      <div class="mb-6 text-sm font-bold text-slate-600">R. Concedei-nos o convívio dos eleitos!</div>
      
      <div class="mb-4">
        <strong>Por Cristo, com Cristo, em Cristo, a vós, Deus Pai todo-poderoso, na unidade do Espírito Santo, toda a honra e toda a glória, agora e para sempre.</strong>
      </div>
      <div class="mb-6 text-center font-bold text-xl text-amber-600">R. AMÉM.</div>
    `
  },
  {
    id: 'euc-1',
    title: 'Oração Eucarística I (Cânon Romano)',
    type: 'prayer',
    content: `
      <div class="mb-6 italic text-slate-500 text-sm">Indicada para grandes Solenidades (Natal, Páscoa, Pentecostes, etc).</div>
      
      <div class="mb-4">
        <div class="mb-1"><strong>V. O Senhor esteja convosco.</strong></div>
        <div class="mb-1">R. Ele está no meio de nós.</div>
      </div>
      <div class="mb-4">
        <div class="mb-1"><strong>V. Corações ao alto.</strong></div>
        <div class="mb-1">R. O nosso coração está em Deus.</div>
      </div>
      <div class="mb-6">
        <div class="mb-1"><strong>V. Demos graças ao Senhor, nosso Deus.</strong></div>
        <div class="mb-1">R. É nosso dever e nossa salvação.</div>
      </div>
      
      <div class="mb-6">
        <strong>Pai de misericórdia, a quem sobem nossos louvores, nós vos pedimos por Jesus Cristo, vosso Filho e Senhor nosso, que aceiteis e abençoeis estes dons, estas oferendas, este sacrifício puro e santo.</strong>
      </div>
      
      <div class="mb-4">
        <strong>Nós os oferecemos pela vossa Igreja santa e católica: concedei-lhe paz e proteção, unindo-a num só corpo e governando-a por toda a terra, em comunhão com vosso servo o Papa N., o nosso Bispo N., e todos os que guardam a fé católica que receberam dos apóstolos.</strong>
      </div>
      <div class="mb-6 text-sm font-bold text-slate-600">R. Abençoai nossa oferenda, ó Senhor!</div>
      
      <div class="mb-4">
        <strong>Lembrai-vos, ó Pai, dos vossos filhos e filhas N. N. e de todos os que circundam este altar, cujas fé e dedicação conheceis. Eles vos oferecem conosco este sacrifício de louvor por si e por todos os seus, e elevam a vós as suas preces, para alcançar o perdão de suas faltas, a segurança em suas vidas e a salvação que esperam.</strong>
      </div>
      <div class="mb-6 text-sm font-bold text-slate-600">R. Lembrai-vos, ó Pai, dos vossos filhos!</div>
      
      <div class="mb-4">
        <strong>Em comunhão com toda a Igreja, veneramos a sempre Virgem Maria, Mãe de nosso Deus e Senhor Jesus Cristo; e também São José, esposo de Maria, os santos Apóstolos e Mártires: Pedro e Paulo, André, (Tiago, João, Tomé, Tiago, Filipe, Bartolomeu, Mateus, Simão e Tadeu, Lino, Cleto, Clemente, Sisto, Cornélio e Cipriano, Lourenço e Crisógono, João e Paulo, Cosme e Damião) e todos os vossos Santos. Por seus méritos e preces concedei-nos sem cessar a vossa proteção.</strong>
      </div>
      <div class="mb-6 text-sm font-bold text-slate-600">R. Em comunhão com toda a Igreja aqui estamos!</div>
      
      <div class="mb-4">
        <strong>Recebei, ó Pai, com bondade, a oferenda dos vossos servos e de toda a vossa família; dai-nos sempre a vossa paz, livrai-nos da condenação eterna e acolhei-nos entre os vossos eleitos.</strong>
      </div>
      <div class="mb-6 text-sm font-bold text-slate-600">R. Recebei, ó Senhor, a nossa oferta!</div>
      
      <div class="mb-4">
        <strong>Dignai-vos, ó Pai, aceitar e santificar estas oferendas, a fim de que se tornem para nós o Corpo e o Sangue de Jesus Cristo, vosso Filho e Senhor nosso.</strong>
      </div>
      <div class="mb-6 text-sm font-bold text-slate-600">R. Santificai nossa oferenda, ó Senhor!</div>
      
      <div class="mb-6">
        <strong>Na véspera de sua paixão, ele tomou o pão em suas santas e veneráveis mãos, elevou os olhos ao céu, a vós, ó Pai todo-poderoso, pronunciou a bênção de ação de graças, partiu o pão e o deu a seus discípulos, dizendo:</strong>
      </div>
      
      <div class="mb-6 text-red-700 font-bold text-center text-lg border-l-4 border-red-200 pl-4 py-2">
        TOMAI, TODOS, E COMEI:<br/>ISTO É O MEU CORPO,<br/>QUE SERÁ ENTREGUE POR VÓS.
      </div>
      
      <div class="mb-6">
        <strong>Do mesmo modo, no fim da ceia, ele tomou este precioso cálice em suas santas e veneráveis mãos, pronunciou novamente a bênção de ação de graças e o deu a seus discípulos, dizendo:</strong>
      </div>
      
      <div class="mb-6 text-red-700 font-bold text-center text-lg border-l-4 border-red-200 pl-4 py-2">
        TOMAI, TODOS, E BEBEI:<br/>ESTE É O CÁLICE DO MEU SANGUE,<br/>O SANGUE DA NOVA E ETERNA ALIANÇA,<br/>QUE SERÁ DERRAMADO POR VÓS E POR TODOS<br/>PARA REMISSÃO DOS PECADOS.<br/>FAZEI ISTO EM MEMÓRIA DE MIM.
      </div>
      
      <div class="mb-2"><strong>Eis o mistério da fé!</strong></div>
      <div class="mb-6 text-sm font-bold text-slate-600">R. Anunciamos, Senhor, a vossa morte e proclamamos a vossa ressurreição. Vinde, Senhor Jesus!</div>
      
      <div class="mb-4">
        <strong>Celebrando, pois, a memória da paixão do vosso Filho, da sua ressurreição dentre os mortos e da sua gloriosa ascensão aos céus, nós, vossos servos, e também vosso povo santo, vos oferecemos, ó Pai, dentre os bens que nos destes, o sacrifício puro, santo e imaculado, Pão santo da vida eterna e Cálice da salvação perpétua.</strong>
      </div>
      <div class="mb-6 text-sm font-bold text-slate-600">R. Recebei, ó Senhor, a nossa oferta!</div>
      
      <div class="mb-4">
        <strong>Recebei, ó Pai, com olhar benigno, esta oferta, como recebestes os dons do justo Abel, o sacrifício de Abraão, nosso pai na fé, e a oblação pura e santa do sumo sacerdote Melquisedeque.</strong>
      </div>
      <div class="mb-6 text-sm font-bold text-slate-600">R. Recebei, ó Senhor, a nossa oferta!</div>
      
      <div class="mb-4">
        <strong>Suplicantes, vos pedimos, ó Deus onipotente, que esta nossa oferta seja levada à vossa presença, no altar do céu, pelas mãos do vosso santo Anjo, para que todos nós, participando deste altar pela comunhão do Santíssimo Corpo e Sangue do vosso Filho, sejamos repletos de toda a graça e bênção do céu.</strong>
      </div>
      <div class="mb-6 text-sm font-bold text-slate-600">R. Recebei, ó Senhor, a nossa oferta!</div>
      
      <div class="mb-4">
        <strong>Lembrai-vos, ó Pai, dos vossos filhos e filhas N. e N., que nos precederam com o sinal da fé e dormem o sono da paz. A eles, e a todos os que descansam em Cristo, concedei o repouso, a luz e a paz.</strong>
      </div>
      <div class="mb-6 text-sm font-bold text-slate-600">R. Concedei-lhes, ó Senhor, a luz eterna!</div>
      
      <div class="mb-4">
        <strong>E a todos nós pecadores, que esperamos na vossa infinita misericórdia, concedei, não por nossos méritos, mas por vossa bondade, o convívio dos Apóstolos e Mártires: João Batista e Estêvão, Matias e Barnabé, (Inácio, Alexandre, Marcelino e Pedro, Felicidade e Perpétua, Águeda e Luzia, Inês, Cecília, Anastácia) e todos os vossos Santos.</strong>
      </div>
      <div class="mb-6 text-sm font-bold text-slate-600">R. Concedei-nos o convívio dos eleitos!</div>
      
      <div class="mb-6">
        <strong>Por ele não cessais de criar e santificar estes bens e vivificar, abençoar e distribuir a nós.</strong>
      </div>
      
      <div class="mb-4">
        <strong>Por Cristo, com Cristo, em Cristo, a vós, Deus Pai todo-poderoso, na unidade do Espírito Santo, toda a honra e toda a glória, agora e para sempre.</strong>
      </div>
      <div class="mb-6 text-center font-bold text-xl text-amber-600">R. AMÉM.</div>
    `
  }
];
