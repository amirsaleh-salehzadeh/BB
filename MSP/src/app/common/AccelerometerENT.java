package app.common;

public class AccelerometerENT {
	public float ACC_X;
	public float ACC_Y;
	public float ACC_Z;

	public AccelerometerENT(float aCC_X, float aCC_Y, float aCC_Z) {
		super();
		ACC_X = aCC_X;
		ACC_Y = aCC_Y;
		ACC_Z = aCC_Z;
	}
	
	public AccelerometerENT() {
		super();
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

	@Override
	public boolean equals(Object obj) {
		AccelerometerENT newAccel = (AccelerometerENT) obj;
		if (newAccel != null
				&& (newAccel.getACC_X() != ACC_X || newAccel.getACC_Y() != ACC_Y || newAccel.getACC_Z() != ACC_Z))
			return false;
		else
			return true;
	}

}
