import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function EditFacilities() {
  const [facilities, setFacilities] = useState([]);
  const [newFacility, setNewFacility] = useState({
    id: '',
    name: '',
    latitude: '',
    longitude: '',
    mesh_id: '',
  });

  // facilities.json をロード
  useEffect(() => {
    fetch('/facilities.json')
      .then((response) => response.json())
      .then((data) => setFacilities(data))
      .catch((error) => console.error('施設データの読み込み中にエラーが発生しました:', error));
  }, []);

  // メッシュIDを計算する関数
  const calculateMeshId = (lon, lat, resolution = 4) => {
    const p = Math.floor((lat * 60) / 40);
    const a = (lat * 60) % 40;
    const q = Math.floor(a / 5);
    const b = a % 5;
    const r = Math.floor((b * 60) / 30);
    const c = (b * 60) % 30;
    const s = Math.floor(c / 15);
    const d = c % 15;
    const t = Math.floor(d / 7.5);

    const u = Math.floor(lon - 100);
    const f = lon - 100 - u;
    const v = Math.floor((f * 60) / 7.5);
    const g = (f * 60) % 7.5;
    const w = Math.floor((g * 60) / 45);
    const h = (g * 60) % 45;
    const x = Math.floor(h / 22.5);
    const i = h % 22.5;
    const y = Math.floor(i / 11.25);

    const m = s * 2 + (x + 1);
    const n = t * 2 + (y + 1);

    //1次メッシュ
    let mesh = `${p}${u}`;
    //2次メッシュ
    if (resolution >= 2) {
      mesh += `${q}${v}`;
      //3次メッシュ
      if (resolution >= 3) {
        mesh += `${r}${w}`;
        // 1/2メッシュ
        if (resolution >= 4) {
          mesh += `${m}`;
          // 1/4メッシュ
          if (resolution >= 5) {
            mesh += `${n}`;
          }
        }
      }
    }

    return mesh;
  };

  // 施設の追加
  const addFacility = () => {
    if (!newFacility.id || !newFacility.name || !newFacility.latitude || !newFacility.longitude) {
      alert('すべてのフィールドを入力してください');
      return;
    }

    const meshId = calculateMeshId(newFacility.longitude, newFacility.latitude); // メッシュIDを計算
    const facilityWithMeshId = { ...newFacility, mesh_id: meshId };

    setFacilities((prev) => [...prev, facilityWithMeshId]);
    setNewFacility({ id: '', name: '', latitude: '', longitude: '', mesh_id: '' });
  };

  // 施設の編集
  const updateFacility = (index, key, value) => {
    const updatedFacilities = [...facilities];
    updatedFacilities[index][key] = value;
    setFacilities(updatedFacilities);
  };

  // 施設の削除
  const deleteFacility = (index) => {
    const updatedFacilities = facilities.filter((_, i) => i !== index);
    setFacilities(updatedFacilities);
  };

  // JSON ファイルとして保存 (ダウンロード)
  const saveToFile = () => {
    const blob = new Blob([JSON.stringify(facilities, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'facilities.json';
    link.click();
  };

  return (
    <div>
      <h1>施設管理</h1>
      <table border="1" style={{ width: '100%', textAlign: 'left', marginBottom: '20px' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>名称</th>
            <th>緯度</th>
            <th>経度</th>
            <th>メッシュID（4次）</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {facilities.map((facility, index) => (
            <tr key={facility.id}>
              <td>
                <input
                  type="text"
                  value={facility.id}
                  onChange={(e) => updateFacility(index, 'id', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={facility.name}
                  onChange={(e) => updateFacility(index, 'name', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={facility.latitude}
                  onChange={(e) => updateFacility(index, 'latitude', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={facility.longitude}
                  onChange={(e) => updateFacility(index, 'longitude', e.target.value)}
                />
              </td>
              <td>{facility.mesh_id || calculateMeshId(facility.longitude, facility.latitude)}</td>
              <td>
                <button onClick={() => deleteFacility(index)}>削除</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <h3>新しい施設を追加</h3>
        <input
          type="text"
          placeholder="ID"
          value={newFacility.id}
          onChange={(e) => setNewFacility({ ...newFacility, id: e.target.value })}
        />
        <input
          type="text"
          placeholder="名称"
          value={newFacility.name}
          onChange={(e) => setNewFacility({ ...newFacility, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="緯度"
          value={newFacility.latitude}
          onChange={(e) => setNewFacility({ ...newFacility, latitude: e.target.value })}
        />
        <input
          type="number"
          placeholder="経度"
          value={newFacility.longitude}
          onChange={(e) => setNewFacility({ ...newFacility, longitude: e.target.value })}
        />
        <button onClick={addFacility}>追加</button>
      </div>
      <button onClick={saveToFile}>JSONファイルとして保存</button>
      <Link to="/">トップページに戻る</Link>
    </div>
  );
}

export default EditFacilities;
