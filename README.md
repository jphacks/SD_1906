# Life Leaf

[![Product Name](image.png)](https://www.youtube.com/watch?v=G5rULR53uMk)

## 製品概要
### 長生き × Tech

### 背景（製品開発のきっかけ、課題等）
今回の開発にあたり着目したのがデスクワーク時の運動不足である．日常の大半を座って過ごす現代人にとって，座りすぎは，肥満，腰痛，集中力の低下や死亡率の増加に至るまで多大な健康被害を及ぼす．この問題の解決策として報告されているのは，1週間に1度のジム通いでも，毎日のランニングでもない．座って居るときに1時間に1度軽く運動（柔軟等）を行うだけ，たったのそれだけで列挙した健康被害を大きく低減させることができる．
そこで私たちが提案するアプリケーションでは，座りすぎをユーザに伝えるものとなっている．
### 製品説明（具体的な製品の説明）
私たちが提案するアプリケーションでは，植物型のデバイスを用いることで座りすぎをユーザに伝えるものとなっている．ユーザが長時間仕事を行っていると，
デスクにおいてある植物の元気がだんだんとなくなっていく．座りすぎによる健康被害を植物の命に反映させ，視覚的に明確にすることでユーザの運動を促すアプリケーションとなっている．
座っている時間は連動したクッション型デバイスから取得する．また，Webアプリと連動することで一日にどれだけ座っていたか，どれだけ運動を挟むことができたのかをグラフで確認することができ，タスクと健康の両方を同時に管理することができる．

![System](lifeleaf_system.png)
### 特長

#### 1. 特長1
植物型デバイス：
クッション型デバイスの情報からユーザが着席しているか，離席しているかによって葉が動くしようとなっている．ユーザが長時間着席している際は葉がだんだんと下に下がり，元気がなくなっていく．
逆に，ユーザが仕事の合間席から立っているときは，植物はすこしづつ元気を取り戻していく．
ユーザの健康と植物の元気が連動するようなデバイスとなっている．

#### 2. 特長2
Webアプリ：
Webアプリではクッション型デバイスから取得した情報をもとに1日の着席時間と離席時間をグラフ化してくれる．グラフは長時間の着席時の寿命の減りを参考に，座りすぎの危険信号がわかるようになっている．

#### 3. 特徴3
クッション型デバイス：
クッションの下で袋に入った気圧センサが，着座時の気圧変化を取得する．このデータをスマホ，植物型デバイスに送信する．


### 解決出来ること
現代人は日常で約8～9時間も座っている時間があるといわれており，座りすぎによる健康被害は社会的な問題にもなっている．今回提案するアプリでは，この社会問題を仕事や趣味の邪魔をすることなく低減させるものとなっている．

### 今後の展望
今回はWebアプリによる連動で，着座時と離席時のグラフのみを表示させていたが，例えば席を立った時の効果的なストレッチを提案することで離席時の運動をより有効的なものにしたり，昇降テーブルと組み合わせることで近未来的な健康重視のワークスペースを実現できると考えている．


## 開発内容・開発技術
### 活用した技術
#### API・データ
今回スポンサーから提供されたAPI、製品などの外部技術があれば記述をして下さい。
* obniz
* DSP310
* 

#### フレームワーク・ライブラリ・モジュール
* node.js
* vue.js
* chart.js
* firebase

#### デバイス
* obniz
* DSP310
* サーボモータ

### 研究内容・事前開発プロダクト（任意）
アイデア出しのみ

### 独自開発技術（Hack Dayで開発したもの）
#### 2日間に開発した独自の機能・技術
* obnizを用いた植物型デバイスおよびクッション型デバイス
* Vue.jsを用いたグラフ表示用のWebアプリケーション
