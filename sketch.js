// ==========================================
// VARIÁVEIS GLOBAIS 
// ==========================================
let estadoJogo = 0; // 0: Menu, 1: Jogando, 2: Game Over, 3: Sobre, 4: Vitória
let vidas = 3;
let score = 0;
let fase = 1;
let tempoMensagem = 0; 

let listaInimigos = [];
let listaTiros = [];

//Assets
let imgPlaneta, imgNave, imgTiro;
let imgInimigo1, imgInimigo2, imgInimigo3, imgInimigo4;
let somTiro, somHitInimigo, somDanoPlaneta;

// ==========================================
// CARREGAMENTO DOS ASSETS
// ==========================================
function preload() {
  imgPlaneta = loadImage('assets/imgPlaneta.png');
  imgNave = loadImage('assets/imgNave.png');
  imgTiro = loadImage('assets/imgTiro.png');
  
  imgInimigo1 = loadImage('assets/img_Inimigo1.png');
  imgInimigo2 = loadImage('assets/imgInimigo2.png');
  imgInimigo3 = loadImage('assets/img_Inimigo3.png');
  imgInimigo4 = loadImage('assets/img_Inimigo4.png');
  
  somTiro = loadSound('assets/somTiro.mp3');
  somHitInimigo = loadSound('assets/somHitInimigo.mp3');
  somDanoPlaneta = loadSound('assets/somDanoPlaneta.mp3');
}

// ==========================================
// INICIALIZAÇÃO
// ==========================================
function setup() {
  createCanvas(800, 600);
  imageMode(CENTER); 
  textAlign(CENTER, CENTER);
}

// ==========================================
// LOOP PRINCIPAL
// ==========================================
function draw() {
  background(20, 20, 40); 
  
  if (estadoJogo === 0) telaMenu();
  else if (estadoJogo === 1) telaJogo();
  else if (estadoJogo === 2) telaGameOver();
  else if (estadoJogo === 3) telaSobre();
  else if (estadoJogo === 4) telaVitoria();
}

// ==========================================
// TELAS DE INTERFACE (UI) E BOTÕES
// ==========================================
function telaMenu() {
  fill(255);
  textSize(40);
  text("ARMAGEDDON", width/2, height/3 - 30);
  
  //Backend Botão (JOGAR)
  let hoverJogar = mouseX > width/2 - 100 && mouseX < width/2 + 100 && mouseY > height/2 - 25 && mouseY < height/2 + 25;
  fill(hoverJogar ? 100 : 50, 255, hoverJogar ? 100 : 50); // Fica verde claro se passar o mouse
  rect(width/2 - 100, height/2 - 25, 200, 50, 10); // O 10 arredonda as bordas
  fill(0);
  textSize(20);
  text("JOGAR", width/2, height/2);

  //Backend Botão (CRÉDITOS)
  let hoverCreditos = mouseX > width/2 - 100 && mouseX < width/2 + 100 && mouseY > height/2 + 60 - 25 && mouseY < height/2 + 60 + 25;
  fill(hoverCreditos ? 200 : 150); // Fica cinza claro se passar o mouse
  rect(width/2 - 100, height/2 + 60 - 25, 200, 50, 10);
  fill(0);
  text("CRÉDITOS", width/2, height/2 + 60);
}

function telaSobre() {
  fill(255);
  textSize(30);
  text("CRÉDITOS", width/2, height/4);
  textSize(20);
  text("Desenvolvido por: Paulo Henrique Simão", width/2, height/2 - 20);
  
  desenharBotaoVoltar();
}

function telaGameOver() {
  fill(255, 50, 50);
  textSize(40);
  text("GAME OVER", width/2, height/3);
  fill(255);
  textSize(20);
  text("Score Final: " + score, width/2, height/2);
  
  desenharBotaoVoltar();
}

function telaVitoria() {
  fill(50, 255, 100);
  textSize(40);
  text("VOCÊ SALVOU O PLANETA!", width/2, height/3);
  fill(255);
  textSize(20);
  text("Score Final: " + score, width/2, height/2);
  
  desenharBotaoVoltar();
}

function desenharBotaoVoltar() {
  let hoverVoltar = mouseX > width/2 - 100 && mouseX < width/2 + 100 && mouseY > height * 0.8 - 25 && mouseY < height * 0.8 + 25;
  fill(hoverVoltar ? 200 : 150);
  rect(width/2 - 100, height * 0.8 - 25, 200, 50, 10);
  fill(0);
  textSize(20);
  text("VOLTAR AO MENU", width/2, height * 0.8);
}

// ==========================================
// CONTROLES DE CLIQUE
// ==========================================
function mousePressed() {
  if (estadoJogo === 0) {
    // Botão (JOGAR)
    if (mouseX > width/2 - 100 && mouseX < width/2 + 100 && mouseY > height/2 - 25 && mouseY < height/2 + 25) {
      iniciarJogo();
    }
    // Botão (CRÉDITOS)
    if (mouseX > width/2 - 100 && mouseX < width/2 + 100 && mouseY > height/2 + 60 - 25 && mouseY < height/2 + 60 + 25) {
      estadoJogo = 3;
    }
  } 
  // Botão (VOLTAR) [GameOver, Vitória ou Créditos]
  else if (estadoJogo === 2 || estadoJogo === 3 || estadoJogo === 4) {
    if (mouseX > width/2 - 100 && mouseX < width/2 + 100 && mouseY > height * 0.8 - 25 && mouseY < height * 0.8 + 25) {
      estadoJogo = 0;
    }
  }
  // Gameplay
  else if (estadoJogo === 1) {
    let posicaoOrigem = createVector(width/2, height/2);
    let alvo = createVector(mouseX, mouseY);
    let direcao = alvo.copy().sub(posicaoOrigem).normalize();
    
    listaTiros.push({
      pos: posicaoOrigem.copy().add(direcao.copy().mult(70)), 
      vel: direcao.mult(10) 
    });
    
    somTiro.play();
  }
}

// ==========================================
// LÓGICA PRINCIPAL DO JOGO
// ==========================================
function iniciarJogo() {
  vidas = 3;
  score = 0;
  fase = 1;
  listaInimigos = [];
  listaTiros = [];
  tempoMensagem = 120; 
  estadoJogo = 1;
}

function telaJogo() {
  HUD();
  image(imgPlaneta, width/2, height/2, 80, 80);
  controlarJogador();
  gerenciarInimigos();
  gerenciarTiros();
  checarColisoes();
  
  if (tempoMensagem > 0) {
    let alphaFade = map(tempoMensagem, 0, 120, 0, 255); 
    fill(255, alphaFade); 
    textSize(60);
    text("FASE " + fase, width/2, height/2 - 100);
    tempoMensagem--; 
  }
}

function HUD() {
  fill(255);
  textSize(20);
  textAlign(LEFT);
  text("Vidas: " + vidas, 20, 30);
  text("Fase: " + fase, 20, 60);
  textAlign(RIGHT);
  text("Score: " + score, width - 20, 30);
  textAlign(CENTER, CENTER);
}

function controlarJogador() {
  let angulo = atan2(mouseY - height/2, mouseX - width/2);
  
  push();
  translate(width/2, height/2); 
  rotate(angulo); 
  translate(60, 0); 
  rotate(PI / 2); 
  image(imgNave, 0, 0, 30, 30); 
  pop();
}

function gerenciarInimigos() {
  let scoreAlvo = fase * 150; 

  if (tempoMensagem === 0 && score < scoreAlvo) {
    let taxaSpawn = fase === 1 ? 60 : (fase === 2 ? 50 : (fase === 3 ? 40 : 30));

    if (frameCount % taxaSpawn === 0) {
      let nascex = random() > 0.5 ? random(-50, 0) : random(width, width+50);
      let nascey = random() > 0.5 ? random(-50, 0) : random(height, height+50);
      
      let tipoSorteado = 1;
      
      if (fase === 2) {
        tipoSorteado = random() > 0.7 ? 2 : 1; 
      } else if (fase === 3) {
        let r = random();
        if (r > 0.75) tipoSorteado = 3;      
        else if (r > 0.4) tipoSorteado = 2;  
        else tipoSorteado = 1;               
      } else if (fase === 4) {
        let r = random();
        if (r > 0.8) tipoSorteado = 4;       
        else if (r > 0.6) tipoSorteado = 3;  
        else if (r > 0.3) tipoSorteado = 2;  
        else tipoSorteado = 1;               
      }

      let inimigo = {
        pos: createVector(nascex, nascey),
        vel: createVector(0, 0),
        tipo: tipoSorteado,
        hp: 1,
        hpMax: 1, 
        pontos: 10,
        velocidadeBase: 2,
        tamanho: 30
      };

      if (tipoSorteado === 2) {
        inimigo.velocidadeBase = 4;        
      } else if (tipoSorteado === 3) {
        inimigo.velocidadeBase = 1;        
        inimigo.hp = 3;                    
        inimigo.hpMax = 3;
        inimigo.tamanho = 45;              
        inimigo.pontos = 30;
      } else if (tipoSorteado === 4) { 
        inimigo.velocidadeBase = 3.5;      
        inimigo.hp = 2;                    
        inimigo.hpMax = 2;
        inimigo.tamanho = 20;              
        inimigo.pontos = 40;
      }

      listaInimigos.push(inimigo);
    }
  } 
  
  if (score >= scoreAlvo && listaInimigos.length === 0) {
    if (fase === 4) {
      estadoJogo = 4; 
    } else {
      fase++;
      vidas = 3; 
      tempoMensagem = 120; 
    }
  }
  
  let centro = createVector(width/2, height/2);
  for (let ini of listaInimigos) {
    let direcao = centro.copy().sub(ini.pos).normalize();
    ini.vel = direcao.mult(ini.velocidadeBase);
    ini.pos.add(ini.vel);
    
    let imgAtual;
    if (ini.tipo === 1) imgAtual = imgInimigo1;
    else if (ini.tipo === 2) imgAtual = imgInimigo2;
    else if (ini.tipo === 3) imgAtual = imgInimigo3;
    else if (ini.tipo === 4) imgAtual = imgInimigo4;
    
    //Meteoro apontando para o planeta.
    push();
    translate(ini.pos.x, ini.pos.y);
    rotate(ini.vel.heading() - PI / 2); 
    image(imgAtual, 0, 0, ini.tamanho, ini.tamanho);
    pop();
    
    //Barra de Vida
    if (ini.hpMax > 1) {
      let larguraBarra = 30;
      let vidaAtualPixels = map(ini.hp, 0, ini.hpMax, 0, larguraBarra); 
      
      fill(100);
      rect(ini.pos.x - larguraBarra/2, ini.pos.y - (ini.tamanho/2) - 12, larguraBarra, 5); 
      fill(50, 255, 50);
      rect(ini.pos.x - larguraBarra/2, ini.pos.y - (ini.tamanho/2) - 12, vidaAtualPixels, 5); 
    }
  }
}

function gerenciarTiros() {
  for (let tiro of listaTiros) {
    tiro.pos.add(tiro.vel);
    
    push();
    translate(tiro.pos.x, tiro.pos.y);
    rotate(tiro.vel.heading() + PI / 2); 
    image(imgTiro, 0, 0, 15, 15);
    pop();
  }
  listaTiros = listaTiros.filter(t => t.pos.x > 0 && t.pos.x < width && t.pos.y > 0 && t.pos.y < height);
}

// ==========================================
// COLISÕES E DANO
// ==========================================
function checarColisoes() {
  let centro = createVector(width/2, height/2);
  
  for (let i = listaInimigos.length - 1; i >= 0; i--) {
    let ini = listaInimigos[i];
    
    if (ini.pos.dist(centro) < 40 + (ini.tamanho/2)) {
      listaInimigos.splice(i, 1);
      vidas--;
      score -= 30; 
      if (score < 0) score = 0; 
      
      somDanoPlaneta.play();
      
      if (vidas <= 0) estadoJogo = 2; 
      continue;
    }
    
    for (let j = listaTiros.length - 1; j >= 0; j--) {
      let tiro = listaTiros[j];
      
      if (ini.pos.dist(tiro.pos) < (ini.tamanho/2) + 5) {
        listaTiros.splice(j, 1); 
        ini.hp--;                
        
        somHitInimigo.play();
        
        if (ini.hp <= 0) {
          listaInimigos.splice(i, 1); 
          score += ini.pontos;
        }
        break; 
      }
    }
  }
}