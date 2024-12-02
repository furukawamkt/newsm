import React, { useEffect, useState, useRef } from 'react';
import { GoogleMap, useLoadScript } from '@react-google-maps/api';
import SelectedFacilityInfo from '../components/SelectedFacilityInfo';

const mapContainerStyle = {
  width: '100%',
  height: '500px',
};

const defaultCenter = { lat: 32.753, lng: 129.871 }; // 地図の初期中心座標

function FacilitySelection() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ['marker'],
  });

  const [facilities, setFacilities] = useState([]);
  const [selectedFacility, setSelectedFacility] = useState(null); // 確定済み施設
  const [pendingFacility, setPendingFacility] = useState(null); // 確認中の施設
  const mapRef = useRef(null);
  const markersRef = useRef([]); // マーカーを保持する配列

  useEffect(() => {
    fetch('/facilities.json')
      .then((response) => response.json())
      .then((data) => setFacilities(data))
      .catch((error) => console.error('Error fetching facilities:', error));
  }, []);

  useEffect(() => {
    if (mapRef.current && facilities.length > 0) {
      facilities.forEach((facility, index) => {
        const content = document.createElement('div');
        content.style.background = '#fff';
        content.style.padding = '5px';
        content.style.borderRadius = '5px';
        content.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
        content.innerHTML = `<strong>${facility.name}</strong>`;

        const marker = new window.google.maps.marker.AdvancedMarkerElement({
          position: { lat: facility.latitude, lng: facility.longitude },
          map: mapRef.current,
          content,
        });

        // マーカーをクリックしたとき
        marker.addListener('click', () => {
          setPendingFacility(facility); // 確認中施設を設定

          // 全てのマーカーの色をリセット
          markersRef.current.forEach((m) =>
            m.content.style.background = '#fff'
          );

          // クリックしたマーカーの色を変更
          marker.content.style.background = '#f0ad4e'; // 色をオレンジに変更
        });

        // マーカーを参照に追加
        markersRef.current[index] = marker;
      });
    }
  }, [facilities]);

  // OK ボタンで localStorage を更新し、SelectedFacilityInfo を明示的に更新
  const confirmSelection = () => {
    if (pendingFacility) {
      localStorage.setItem('selectedFacility', JSON.stringify(pendingFacility));
      setSelectedFacility(pendingFacility); // 確定施設を更新
      setPendingFacility(null); // 確認中施設をリセット
    }
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  console.log(process.env.REACT_APP_GOOGLE_MAPS_MAP_ID);

  return (
    <div>
      {/* 確定済み施設をSelectedFacilityInfoに渡す */}
      <SelectedFacilityInfo externalSelectedFacility={selectedFacility} />
      <h1>施設選択</h1>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={14}
        center={defaultCenter}
        onLoad={(map) => (mapRef.current = map)}
        options={{
          mapId: process.env.REACT_APP_GOOGLE_MAPS_MAP_ID,
        }}
      />
      {pendingFacility && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '3px',
            marginTop: '3px',
            backgroundColor: '#f9f9f9',
            border: '1px solid #ddd',
            borderRadius: '3px',
          }}
        >
          {/* 横並びの施設情報 */}
          <div style={{ flex: 1, display: 'flex', justifyContent: 'space-around' }}>
            <p>
              <strong>名称:</strong> {pendingFacility.name}
            </p>
            <p>
              <strong>緯度:</strong> {pendingFacility.latitude}
            </p>
            <p>
              <strong>経度:</strong> {pendingFacility.longitude}
            </p>
            <p>
              <strong>経度:</strong> {pendingFacility.mesh_id}
            </p>
          </div>
          {/* OK ボタン */}
          <button
            onClick={confirmSelection}
            style={{
              padding: '10px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            OK
          </button>
        </div>
      )}
    </div>
  );
}

export default FacilitySelection;
