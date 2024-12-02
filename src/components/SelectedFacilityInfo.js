import React, { useEffect, useState } from 'react';

function SelectedFacilityInfo({ externalSelectedFacility }) {
  const [selectedFacility, setSelectedFacility] = useState(null);

  // 初期ロード時と externalSelectedFacility の変更時に対応
  useEffect(() => {
    if (externalSelectedFacility) {
      // 外部から渡された施設情報を優先して設定
      setSelectedFacility(externalSelectedFacility);
    } else {
      // 渡されなければ localStorage から取得
      const facility = localStorage.getItem('selectedFacility');
      if (facility) {
        setSelectedFacility(JSON.parse(facility));
      }
    }
  }, [externalSelectedFacility]);

  // 選択施設をクリアする
  const clearSelectedFacility = () => {
    localStorage.removeItem('selectedFacility'); // localStorage をクリア
    setSelectedFacility(null); // 状態をリセット
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: '10px', background: '#f4f4f4' }}>
      {selectedFacility ? (
        <>
          <div style={{ marginRight: '20px' }}>
            <strong>選択施設:</strong>
          </div>
          <div style={{ marginRight: '20px' }}>
            <strong>名称:</strong> {selectedFacility.name}
          </div>
          <div style={{ marginRight: '20px' }}>
            <strong>緯度:</strong> {selectedFacility.latitude}
          </div>
          <div style={{ marginRight: '20px' }}>
            <strong>経度:</strong> {selectedFacility.longitude}
          </div>
          <div style={{ marginRight: '20px' }}>
            <strong>メッシュID:</strong> {selectedFacility.mesh_id}
          </div>
          <button
            onClick={clearSelectedFacility}
            style={{
              marginLeft: 'auto',
              padding: '5px 10px',
              background: '#d9534f',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Clear
          </button>
        </>
      ) : (
        <div>
          <strong>（選択施設なし）</strong>
        </div>
      )}
    </div>
  );
}

export default SelectedFacilityInfo;
