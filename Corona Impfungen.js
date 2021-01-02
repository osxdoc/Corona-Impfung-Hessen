// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: teal; icon-glyph: magic;

/*Wähle das Bundesland
0 Baden-Würtemberg
1 Bayern
2 Brandenburg
3 Berlin
4 Bremen
5 Hamburg
6 Hessen
7 Mecklenburg-Vorpommern
8 Niedersachsen
9 NRW
10 Rheinland-Pfalz
11 Saarland
12 Sachsen-Anhalt
13 Sachsen
14 Schleswig-Holstein
15 Thüringen

*/

//Bundesland
const BL = 6

const apiUrl = "https://interactive.zeit.de/cronjobs/2020/corona/impfzahlen.json"

const widget = await createWidget();

if (!config.runsInWidget) {
    await widget.presentSmall();
}

Script.setWidget(widget);
Script.complete();

async function createWidget() {
    function getTextColor() {
        return Device.isUsingDarkAppearance() ? Color.white() : Color.black();
    }

    let fixedData =
        [
            {id:  0, BL_Text:  "BW",      Einwohner: 11070000},
            {id:  1, BL_Text:  "Bayern",  Einwohner: 13080000},
            {id:  2, BL_Text:  "BB",      Einwohner:  2520000},
            {id:  3, BL_Text:  "Berlin",  Einwohner:  3769000},
            {id:  4, BL_Text:  "Bremen",  Einwohner:   681000},
            {id:  5, BL_Text:  "Hamburg", Einwohner:  1845000},
            {id:  6, BL_Text:  "Hessen",  Einwohner:  6266000},
            {id:  7, BL_Text:  "MV",      Einwohner:  1610000},
            {id:  8, BL_Text:  "NI",      Einwohner:  7982000},
            {id:  9, BL_Text:  "NRW",     Einwohner: 17947000},
            {id: 10, BL_Text:  "RP",      Einwohner:  4085000},
            {id: 11, BL_Text:  "SL",      Einwohner:   987000},
            {id: 12, BL_Text:  "ST",      Einwohner:  2208000},
            {id: 13, BL_Text:  "Sachsen", Einwohner:  4078000},
            {id: 14, BL_Text:  "SH",      Einwohner:  2890000},
            {id: 15, BL_Text:  "TH",      Einwohner:  2137000},
        ];

    const data = await new Request(apiUrl).loadJSON();
    const list = new ListWidget()

    // all the calculations
    var impfGes = 0;
    for (var i = 0; i < 16; i++) {
        impfGes = impfGes + data.bundeslaender[i].historical[0].value;
    }

    let impfGes_pro = impfGes / 83020000 * 100;
    let einwohner = fixedData[BL].Einwohner
    let BL_Text = fixedData[BL].BL_Text
    let impfBL_pro = data.bundeslaender[BL].historical[0].value / einwohner * 100;

    let txt_impfGes = impfGes.toLocaleString('de-DE');
    let txt_impfGes_percentage = parseInt(impfGes_pro.toFixed(2)).toLocaleString('de-DE')
    let txt_impfBL = data.bundeslaender[BL].historical[0].value.toLocaleString('de-DE');
    let txt_impfBL_percentage = parseInt(impfBL_pro.toFixed(2)).toLocaleString('de-DE')

    // all the rendering
    if (Device.isUsingDarkAppearance()) {
        const gradient = new LinearGradient()
        gradient.locations = [0, 1]
        gradient.colors = [
            new Color("111111"),
            new Color("222222")
        ]
        list.backgroundGradient = gradient
    }

    let line1_header = "💉 Impfungen".toUpperCase()
    let line2_vaccines_nationwide = "" + txt_impfGes + " - " + txt_impfGes_percentage + "%" // e.g. 188.553 - 0,23%
    let line3_vaccines_total_text = "Impfungen Gesamt"
    let line4_vaccines_state = "" + txt_impfBL + " - " + txt_impfBL_percentage + "%" // e.g. 24.791 - 0,40%
    let line5_vaccines_state_text = "Impfungen " + BL_Text  //e.g. Impfungen Hessen
    let line6_date = "Stand: " + data.timestamp[0].id.split(",")[0];

    // Line 1: Header
    const header = list.addText(line1_header)
    header.font = Font.mediumSystemFont(13)
    header.textColor = getTextColor();
    list.addSpacer();

    // Line 2: 188.553 - 0,23%
    label = list.addText(line2_vaccines_nationwide);
    label.font = Font.boldSystemFont(12.5);
    label.textColor = Color.green();

    // Line 3: Impfungen Gesamt
    label = list.addText(line3_vaccines_total_text);
    label.font = Font.boldSystemFont(12);
    label.textOpacity = 0.5;
    label.textColor = getTextColor();
    list.addSpacer();

    // Line 4: 24.791 - 0,40%
    label = list.addText(line4_vaccines_state);
    label.font = Font.boldSystemFont(12.5);
    label.textColor = Color.green()

    // Line 5: Impfungen Hessen
    label = list.addText(line5_vaccines_state_text);
    label.font = Font.boldSystemFont(12);
    label.textOpacity = 0.5;
    label.textColor = getTextColor();

    list.addSpacer();

    // Line 6: 2.1.2021
    label = list.addText(line6_date);
    label.font = Font.boldSystemFont(11);
    label.textColor = getTextColor();

    list.refreshAfterDate = new Date(Date.now() + 60 * 60 * 1000)
    return list;
}
