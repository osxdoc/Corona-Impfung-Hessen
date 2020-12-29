// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: teal; icon-glyph: magic;



const apiUrl = ""


const widget = await createWidget();

if (!config.runsInWidget) {
  await widget.presentSmall();
}

Script.setWidget(widget);
Script.complete();

async function createWidget() {

const data = await new Request(apiUrl).loadJSON();

const list = new ListWidget()
  
  if(Device.isUsingDarkAppearance()){
    const gradient = new LinearGradient()
    gradient.locations = [0, 1]
    gradient.colors = [
      new Color("111111"),
      new Color("222222")
    ]
    list.backgroundGradient = gradient
  }
  
  const header = list.addText("💉 Impfungen".toUpperCase())
  header.font = Font.mediumSystemFont(13)
  
  header.textColor = Device.isUsingDarkAppearance() ? Color.white() : Color.black();

  list.addSpacer();


  var impfGes=0;
  
  for (var i=0; i<16; i++) {
    impfGes=impfGes+data.bundeslaender[i].historical[0].value;
  }

var impfGes_pro = impfGes/83020000*100;
  impfGes_pro=impfGes_pro.toFixed(2);
  
  label = list.addText("" + impfGes + " - " + impfGes_pro + "%");
  label.font = Font.boldSystemFont(15.8);
  label.textColor = Color.green();
  
  var label = list.addText("Impfungen Gesamt");
  label.font = Font.boldSystemFont(12);
  label.textOpacity = 0.5;
  label.textColor = Device.isUsingDarkAppearance() ? Color.white() : Color.black();
  
  list.addSpacer();
   
  var impfNRW=data.bundeslaender[9].historical[0].value;
  var impfNRW_pro=data.bundeslaender[9].historical[0].value/17932000*100;
  impfNRW_pro=impfNRW_pro.toFixed(2);
    
  label = list.addText("" + impfNRW + " - " + impfNRW_pro + "%");
  label.font = Font.boldSystemFont(15.8);
  label.textColor = Color.green()
  
  label = list.addText("Impfungen NRW " );
  label.font = Font.boldSystemFont(12);
  label.textOpacity = 0.5;
  label.textColor = Device.isUsingDarkAppearance() ? Color.white() : Color.black();
  
  list.addSpacer();
  
  label = list.addText("Stand: " + data.timestamp[0].id.substr(0, 10));
  label.font = Font.boldSystemFont(11);
  label.textColor = Device.isUsingDarkAppearance() ? Color.white() : Color.black();  
  
  
 return list;
}