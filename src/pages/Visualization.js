import React, { useEffect, useState } from 'react';
import SelectedFacilityInfo from '../components/SelectedFacilityInfo';

function Visualization() {
  const [meshId, setMeshId] = useState(); // 初期メッシュID

  // メッシュIDを算出する関数
  const calculateMeshId = (lon, lat, resolution = 4) => {
    var p = Math.floor((lat * 60) / 40);
    var a = (lat * 60) % 40;
    var q = Math.floor(a / 5);
    var b = a % 5;
    var r = Math.floor((b * 60) / 30);
    var c = (b * 60) % 30;
    var s = Math.floor(c / 15);
    var d = c % 15;
    var t = Math.floor(d / 7.5);

    var u = Math.floor(lon - 100);
    var f = lon - 100 - u;
    var v = Math.floor((f * 60) / 7.5);
    var g = (f * 60) % 7.5;
    var w = Math.floor((g * 60) / 45);
    var h = (g * 60) % 45;
    var x = Math.floor(h / 22.5);
    var i = h % 22.5;
    var y = Math.floor(i / 11.25);

    var m = (s * 2) + (x + 1);
    var n = (t * 2) + (y + 1);

    //1次メッシュ
    var mesh = "" + p + u;
    //2次メッシュ
    if(resolution >= 2){
        mesh = mesh + q + v;
        //3次メッシュ
        if(resolution >= 3){
            mesh = mesh + r + w;
            // 1/2メッシュ
            if(resolution >= 4){
                mesh = mesh + m;
                // 1/4メッシュ
                if(resolution >=5){
                    mesh = mesh + n;
                }
            }
        }
    }

    return mesh;
};

  // localStorageから選択施設を取得
  const fetchSelectedFacility = () => {
    const facility = localStorage.getItem('selectedFacility');
    if (facility) {
      return JSON.parse(facility); // JSON文字列をオブジェクトに変換
    }
    return null;
  };

  useEffect(() => {
    const facility = fetchSelectedFacility();
    if (facility && facility.latitude && facility.longitude) {
      const newMeshId = calculateMeshId(facility.longitude, facility.latitude);
      setMeshId(newMeshId);
    }
  }, []); // コンポーネントがマウントされたときに一度実行

  // iframeのURLを生成
  const generateIframeUrl = (meshId) => {
    return `https://lookerstudio.google.com/embed/reporting/c05ff6af-0634-4097-b493-2f356292aa38/page/yzVXE?params={"ds4.mesh_id":"${meshId}"}`;
  };

  return (
    <div>
      <SelectedFacilityInfo />
      <h1>可視化</h1>
      <iframe
        src={generateIframeUrl(meshId)}
        width="100%"
        height="600"
        style={{ border: 'none' }}
        title="Looker Studio Visualization"
      ></iframe>
    </div>
  );
}

export default Visualization;
