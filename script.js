let https = require('https');

const _api_host   = 'digital.iservices.rte-france.com';

// A RECUPERER DEPUIS L INTERFACE RTE
// DANS L ONGLET "MES APPLICATIONS"
// ID Client | ID Secret ---> bouton "Copier en base 64"
const _secret_key = '';


let _access_token = '';


// RECUPERATION DU TOKEN OAUTH
const request = https.request({
    hostname: _api_host,
    port: 443,
    path: "/token/oauth/",
    method: 'GET',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic '+_secret_key
    }
}, res => {

  // RECUPERATION DU TOKEN EN JSON
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
      var d = JSON.parse(data);

      // SI TOKEN RECUPERE
      if(d.access_token !==undefined)
      {
        _access_token = d.access_token;
        getEcowattData();
      }
  })
});

request.on('error', error => {
  console.error(`Error on Get Request --> ${error}`)
})

request.end()


function getEcowattData()
{
  // RECUPERATION DES DONNEES ECOWATT
  // DEPUIS L API RTE
  const request = https.request({
      hostname: _api_host,
      port: 443,
      path: "/open_api/ecowatt/v4/signals/",
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer '+_access_token
      }
  }, res => {

    // RECUPERATION DES DONNEES DES 4 PROCHAINS JOURS EN JSON
    let data = '';

    // Un morceau de réponse est reçu
    res.on('data', (chunk) => {
      data += chunk;
    });

    // TOUTES LES DATAS SONT LA
    res.on('end', () => {
        var ecowattObject = JSON.parse(data);

        // ET AMUSEZ VOUS AVEC LES DATAS
        console.log(ecowattObject);

      })
  });

  request.on('error', error => {
    console.error(`Error on Get Request --> ${error}`)
  })

  request.end()
}
