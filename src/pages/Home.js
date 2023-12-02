import React, { useState, useEffect } from "react";
import QRCode from "qrcode.react";
import { firestore } from "../firebase";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [latestWifiData, setLatestWifiData] = useState(null);

  useEffect(() => {
    const fetchLatestWifiData = async () => {
      try {
        const wifiCollection = collection(firestore, "wifi");
        const q = query(
          wifiCollection,
          orderBy("createdDate", "desc"),
          limit(1)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const latestData = querySnapshot.docs[0].data();
          setLatestWifiData(latestData);
        }
      } catch (error) {
        console.error("Error fetching latest wifi data: ", error);
      }
    };

    fetchLatestWifiData();
  }, []);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp.seconds * 1000); // Convert to milliseconds
    return date.toLocaleString(); // Adjust the format as needed
  };

  const goToInput = () => {
    navigate("/input");
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        gap: 48
      }}
    >
      {latestWifiData && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 16,
          }}
        >
          <QRCode
            value={`WIFI:T:WPA;S:${latestWifiData.ssid};P:${latestWifiData.password};;`}
            size={256}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div style={{ fontFamily: "monospace", fontSize: 18 }}>
              {latestWifiData.ssid}
            </div>
            <div style={{ fontFamily: "monospace", fontSize: 10 }}>
              {formatTimestamp(latestWifiData.createdDate)}
            </div>
          </div>
        </div>
      )}
      <button type="button" onClick={goToInput} style={buttonStyle}>
        Ubah WiFi
      </button>
    </div>
  );
};

const buttonStyle = {
  backgroundColor: "#4CAF50",
  color: "white",
  padding: "10px 15px",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

export default Home;
