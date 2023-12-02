import { addDoc, collection, getDocs, limit, orderBy, query, serverTimestamp } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { firestore } from "../firebase";
import { useNavigate } from "react-router-dom";

const Input = () => {
  const navigate = useNavigate();
  const [latestWifiData, setLatestWifiData] = useState(null);
  const generatePassword = (length) => {
    // const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const charset = "ABCDEFGHJKMNPQRSTUVWXYZ123456789";
    let password = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset.charAt(randomIndex);
    }

    return password;
  };

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      ssid: "Warung Amanah",
      password: generatePassword(20),
    },
  });

  const onSubmit = async (data) => {
    try {
      const wifiCollection = collection(firestore, "wifi");
      await addDoc(wifiCollection, {
        ssid: data.ssid,
        password: data.password,
        createdDate: serverTimestamp(),
      });
      reset();

      // Redirect to the home page ("/") after successful submission
      navigate("/");
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const goToHome = () => {
    navigate("/");
  };

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

  return (
    <div style={container}>
      {latestWifiData && (

      <div style={cardStyle}>
        <h2>WiFi Sekarang</h2>
        <span style={labelStyle}> SSID: {latestWifiData.ssid}</span>
        <span style={labelStyle}> Password: {latestWifiData.password}</span>
      </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} style={cardStyle}>
        <h2>Ubah WiFi</h2>
        <label style={labelStyle}>
          SSID:
          <input
            type="text"
            {...register("ssid")}
            style={inputStyle}
            required
            readOnly
          />
        </label>
        <label style={labelStyle}>
          Password:
          <input
            type="text"
            {...register("password")}
            style={inputStyle}
            required
          />
        </label>
        <button type="submit" style={buttonStyle}>
          Simpan
        </button>
        <button type="button" onClick={handleRefresh} style={buttonStyle2}>
          Refresh
        </button>
        <button type="button" onClick={goToHome} style={buttonStyle2}>
          Kembali
        </button>
      </form>
    </div>
  );
};

const container = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
};

const cardStyle = {
  display: "flex",
  flexDirection: "column",
  width: "300px",
  margin: "16px",
  padding: "20px",
  border: "1px solid #ccc",
  borderRadius: "5px",
};

const labelStyle = {
  marginBottom: "8px",
};

const inputStyle = {
  width: "100%",
  padding: "8px",
  boxSizing: "border-box",
  marginBottom: "16px",
};

const buttonStyle = {
  backgroundColor: "#4CAF50",
  color: "white",
  padding: "10px 15px",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

const buttonStyle2 = {
  backgroundColor: "#a7a7a7",
  color: "white",
  padding: "10px 15px",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  marginTop: 16,
};

export default Input;
