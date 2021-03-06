package app.common;

import java.util.HashMap;

public class MuseSignalEntity {
	public float alpha = 0;
	public float beta = 0;
	public float teta = 0;
	public float gamma = 0;
	public float delta = 0;
	public float lowFreq = 0;
	public float alphaABS = 0;
	public float betaABS = 0;
	public float tetaABS = 0;
	public float gammaABS = 0;
	public float deltaABS = 0;
	public float lowFreqABS = 0;
	public float alphaR = 0;
	public float betaR = 0;
	public float tetaR = 0;
	public float gammaR = 0;
	public float deltaR = 0;
	public float lowFreqR = 0;
	public float _alpha = 0;
	public float _beta = 0;
	public float _teta = 0;
	public float _gamma = 0;
	public float _delta = 0;
	public boolean foreheadConneted;
	public boolean blink;
	public float[] horseShoes;
	public float battery;
	public float temprature;
	public float DRL;
	public float REF;
	public float ACC_X;
	public float ACC_Y;
	public float ACC_Z;
	public float GYRO_X;
	public float GYRO_Y;
	public float GYRO_Z;
	public float EEG1 = 0;
	public float EEG2 = 0;
	public float EEG3 = 0;
	public float EEG4 = 0;
	public float Concentration = 0;
	public float Meditation = 0;
	public float RNN = 0;
	public float ANN = 0;
	public float SVN = 0;
	
	public float getRNN() {
		return RNN;
	}

	public void setRNN(float rNN) {
		RNN = rNN;
	}

	public float getANN() {
		return ANN;
	}

	public void setANN(float aNN) {
		ANN = aNN;
	}

	public float getSVN() {
		return SVN;
	}

	public void setSVN(float sVN) {
		SVN = sVN;
	}

	public String IMG = "";

	public float getLowFreqABS() {
		return lowFreqABS;
	}

	public void setLowFreqABS(float lowFreqABS) {
		this.lowFreqABS = lowFreqABS;
	}

	public float getAlphaABS() {
		return alphaABS;
	}

	public void setAlphaABS(float alphaABS) {
		this.alphaABS = alphaABS;
	}

	public float getBetaABS() {
		return betaABS;
	}

	public void setBetaABS(float betaABS) {
		this.betaABS = betaABS;
	}

	public float getTetaABS() {
		return tetaABS;
	}

	public void setTetaABS(float tetaABS) {
		this.tetaABS = tetaABS;
	}

	public float getGammaABS() {
		return gammaABS;
	}

	public void setGammaABS(float gammaABS) {
		this.gammaABS = gammaABS;
	}

	public float getDeltaABS() {
		return deltaABS;
	}

	public void setDeltaABS(float deltaABS) {
		this.deltaABS = deltaABS;
	}

	public float getLowFreqR() {
		return lowFreqR;
	}

	public void setLowFreqR(float lowFreqR) {
		this.lowFreqR = lowFreqR;
	}

	public float getAlphaR() {
		return alphaR;
	}

	public void setAlphaR(float alphaR) {
		this.alphaR = alphaR;
	}

	public float getBetaR() {
		return betaR;
	}

	public void setBetaR(float betaR) {
		this.betaR = betaR;
	}

	public float getTetaR() {
		return tetaR;
	}

	public void setTetaR(float tetaR) {
		this.tetaR = tetaR;
	}

	public float getGammaR() {
		return gammaR;
	}

	public void setGammaR(float gammaR) {
		this.gammaR = gammaR;
	}

	public float getDeltaR() {
		return deltaR;
	}

	public void setDeltaR(float deltaR) {
		this.deltaR = deltaR;
	}

	public float getGYRO_X() {
		return GYRO_X;
	}

	public void setGYRO_X(float gYRO_X) {
		GYRO_X = gYRO_X;
	}

	public float getGYRO_Y() {
		return GYRO_Y;
	}

	public void setGYRO_Y(float gYRO_Y) {
		GYRO_Y = gYRO_Y;
	}

	public float getGYRO_Z() {
		return GYRO_Z;
	}

	public void setGYRO_Z(float gYRO_Z) {
		GYRO_Z = gYRO_Z;
	}

	
	/**
	 * @return the iMG
	 */
	public String getIMG() {
		return IMG;
	}

	/**
	 * @param iMG
	 *            the iMG to set
	 */
	public void setIMG(String iMG) {
		IMG = iMG;
	}

	/**
	 * @return the concentration
	 */
	public float getConcentration() {
		return Concentration;
	}

	/**
	 * @param concentration
	 *            the concentration to set
	 */
	public void setConcentration(float concentration) {
		Concentration = concentration;
	}

	/**
	 * @return the meditation
	 */
	public float getMeditation() {
		return Meditation;
	}

	/**
	 * @param meditation
	 *            the meditation to set
	 */
	public void setMeditation(float meditation) {
		Meditation = meditation;
	}

	public boolean isBlink() {
		return blink;
	}

	public void setBlink(boolean blink) {
		this.blink = blink;
	}

	public MuseSignalEntity(float alpha, float beta, float teta, float gamma, float delta, float _alpha, float _beta,
			float _teta, float _gamma, float _delta, float lowFreq, boolean foreheadConneted, float[] horseShoes,
			float battery, float temprature, float dRL, float rEF, float aCC_X, float aCC_Y, float aCC_Z, float eEG1,
			float eEG2, float eEG3, float eEG4, float concentration, float meditation) {
		super();
		this.alpha = alpha;
		this.beta = beta;
		this.teta = teta;
		this.gamma = gamma;
		this.delta = delta;
		this._alpha = _alpha;
		this._beta = _beta;
		this._teta = _teta;
		this._gamma = _gamma;
		this._delta = _delta;
		this.lowFreq = lowFreq;
		this.foreheadConneted = foreheadConneted;
		this.horseShoes = horseShoes;
		this.battery = battery;
		this.temprature = temprature;
		this.DRL = dRL;
		this.REF = rEF;
		this.ACC_X = aCC_X;
		this.ACC_Y = aCC_Y;
		this.ACC_Z = aCC_Z;
		this.EEG1 = eEG1;
		this.EEG2 = eEG2;
		this.EEG3 = eEG3;
		this.EEG4 = eEG4;
		this.Concentration = concentration;
		this.Meditation = meditation;
	}

	public boolean isForeheadConneted() {
		return foreheadConneted;
	}

	public void setForeheadConneted(boolean foreheadConneted) {
		this.foreheadConneted = foreheadConneted;
	}

	public float[] getHorseShoes() {
		return horseShoes;
	}

	public void setHorseShoes(float[] horseShoes) {
		this.horseShoes = horseShoes;
	}

	public float getBattery() {
		return battery;
	}

	public void setBattery(float battery) {
		this.battery = battery;
	}

	public float getTemprature() {
		return temprature;
	}

	public void setTemprature(float temprature) {
		this.temprature = temprature;
	}

	public float getDRL() {
		return DRL;
	}

	public void setDRL(float dRL) {
		DRL = dRL;
	}

	public float getREF() {
		return REF;
	}

	public void setREF(float rEF) {
		REF = rEF;
	}

	public float getACC_X() {
		return ACC_X;
	}

	public void setACC_X(float aCC_X) {
		ACC_X = (float) (aCC_X * 9.8);
	}

	public float getACC_Y() {
		return ACC_Y;
	}

	public void setACC_Y(float aCC_Y) {
		ACC_Y = (float) (aCC_Y * 9.8);
	}

	public float getACC_Z() {
		return ACC_Z;
	}

	public void setACC_Z(float aCC_Z) {
		ACC_Z = (float) (aCC_Z * 9.8);
	}

	public MuseSignalEntity(float alpha, float beta, float teta, float gamma, float delta, float _alpha, float _beta,
			float _teta, float _gamma, float _delta, float lowFreq, float eEG1, float eEG2, float eEG3, float eEG4) {
		super();
		this.alpha = alpha;
		this.beta = beta;
		this.teta = teta;
		this.gamma = gamma;
		this.delta = delta;
		this._alpha = _alpha;
		this._beta = _beta;
		this._teta = _teta;
		this._gamma = _gamma;
		this._delta = _delta;
		this.lowFreq = lowFreq;
		EEG1 = eEG1;
		EEG2 = eEG2;
		EEG3 = eEG3;
		EEG4 = eEG4;
	}

	public float get_alpha() {
		return _alpha;
	}

	public void set_alpha(float _alpha) {
		this._alpha = _alpha;
	}

	public float get_beta() {
		return _beta;
	}

	public void set_beta(float _beta) {
		this._beta = _beta;
	}

	public float get_teta() {
		return _teta;
	}

	public void set_teta(float _teta) {
		this._teta = _teta;
	}

	public float get_gamma() {
		return _gamma;
	}

	public void set_gamma(float _gamma) {
		this._gamma = _gamma;
	}

	public float get_delta() {
		return _delta;
	}

	public void set_delta(float _delta) {
		this._delta = _delta;
	}

	public float getLowFreq() {
		return lowFreq;
	}

	public void setLowFreq(float lowFreq) {
		this.lowFreq = lowFreq;
	}

	public float getAlpha() {
		return alpha;
	}

	public void setAlpha(float alpha) {
		this.alpha = alpha;
	}

	public float getBeta() {
		return beta;
	}

	public void setBeta(float beta) {
		this.beta = beta;
	}

	public float getTeta() {
		return teta;
	}

	public void setTeta(float teta) {
		this.teta = teta;
	}

	public float getGamma() {
		return gamma;
	}

	public void setGamma(float gamma) {
		this.gamma = gamma;
	}

	public float getDelta() {
		return delta;
	}

	public void setDelta(float delta) {
		this.delta = delta;
	}

	public float getEEG1() {
		return EEG1;
	}

	public void setEEG1(float eEG1) {
		EEG1 = eEG1;
	}

	public float getEEG2() {
		return EEG2;
	}

	public void setEEG2(float eEG2) {
		EEG2 = eEG2;
	}

	public float getEEG3() {
		return EEG3;
	}

	public void setEEG3(float eEG3) {
		EEG3 = eEG3;
	}

	public float getEEG4() {
		return EEG4;
	}

	public void setEEG4(float eEG4) {
		EEG4 = eEG4;
	}

	public MuseSignalEntity(float alpha, float beta, float teta, float gamma, float delta, float lowFreq, float eEG1,
			float eEG2, float eEG3, float eEG4) {
		super();
		this.alpha = alpha;
		this.beta = beta;
		this.teta = teta;
		this.gamma = gamma;
		this.delta = delta;
		this.lowFreq = lowFreq;
		EEG1 = eEG1;
		EEG2 = eEG2;
		EEG3 = eEG3;
		EEG4 = eEG4;
	}

	public MuseSignalEntity() {
		super();
	}

}
