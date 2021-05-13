const USER_TYPES = {
	Patient: "PATIENT",
	Doctor: "DOCTOR",
	Lab_Technician: "LAB_TECHNICIAN",
	Pharmacist: "PHARMACIST",
};

const TEST_STATUS = {
	assigned: "ASSIGNED",
	preparing: "PREPARING",
	finalized: "FINALIZED",
};

const COMP_SCORE = {
	preparing: 0,
	finalized: 1,
};

const APPT_STATUS = {
	ONGOING: 'ONGOING',
	COMPLETE: 'COMPLETE',
}

module.exports = {
	USER_TYPES,
	TEST_STATUS,
	COMP_SCORE,
	APPT_STATUS,
};
