/**
 */
package edu.kit.ipd.sdq.metamodels.families.impl;

import edu.kit.ipd.sdq.metamodels.families.FamiliesPackage;
import edu.kit.ipd.sdq.metamodels.families.Family;
import edu.kit.ipd.sdq.metamodels.families.FamilyRegister;
import edu.kit.ipd.sdq.metamodels.families.Member;

import java.util.Collection;

import org.eclipse.emf.common.notify.Notification;
import org.eclipse.emf.common.notify.NotificationChain;

import org.eclipse.emf.common.util.EList;

import org.eclipse.emf.ecore.EClass;
import org.eclipse.emf.ecore.InternalEObject;

import org.eclipse.emf.ecore.impl.ENotificationImpl;

import org.eclipse.emf.ecore.util.EObjectContainmentEList;
import org.eclipse.emf.ecore.util.InternalEList;

/**
 * <!-- begin-user-doc -->
 * An implementation of the model object '<em><b>Family Register</b></em>'.
 * <!-- end-user-doc -->
 * <p>
 * The following features are implemented:
 * </p>
 * <ul>
 *   <li>{@link edu.kit.ipd.sdq.metamodels.families.impl.FamilyRegisterImpl#getFamilies <em>Families</em>}</li>
 *   <li>{@link edu.kit.ipd.sdq.metamodels.families.impl.FamilyRegisterImpl#getTest <em>Test</em>}</li>
 *   <li>{@link edu.kit.ipd.sdq.metamodels.families.impl.FamilyRegisterImpl#getFam <em>Fam</em>}</li>
 * </ul>
 *
 * @generated
 */
public class FamilyRegisterImpl extends IdentifiableImpl implements FamilyRegister
{
	/**
	 * The cached value of the '{@link #getFamilies() <em>Families</em>}' containment reference list.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see #getFamilies()
	 * @generated
	 * @ordered
	 */
	protected EList<Family> families;

	/**
	 * The cached value of the '{@link #getTest() <em>Test</em>}' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see #getTest()
	 * @generated
	 * @ordered
	 */
	protected Member test;

	/**
	 * The cached value of the '{@link #getFam() <em>Fam</em>}' containment reference list.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see #getFam()
	 * @generated
	 * @ordered
	 */
	protected EList<Member> fam;

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	protected FamilyRegisterImpl()
	{
		super();
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	@Override
	protected EClass eStaticClass()
	{
		return FamiliesPackage.Literals.FAMILY_REGISTER;
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	@Override
	public EList<Family> getFamilies()
	{
		if (families == null) {
			families = new EObjectContainmentEList<Family>(Family.class, this, FamiliesPackage.FAMILY_REGISTER__FAMILIES);
		}
		return families;
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	@Override
	public Member getTest()
	{
		if (test != null && test.eIsProxy()) {
			InternalEObject oldTest = (InternalEObject)test;
			test = (Member)eResolveProxy(oldTest);
			if (test != oldTest) {
				if (eNotificationRequired())
					eNotify(new ENotificationImpl(this, Notification.RESOLVE, FamiliesPackage.FAMILY_REGISTER__TEST, oldTest, test));
			}
		}
		return test;
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public Member basicGetTest()
	{
		return test;
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	@Override
	public void setTest(Member newTest)
	{
		Member oldTest = test;
		test = newTest;
		if (eNotificationRequired())
			eNotify(new ENotificationImpl(this, Notification.SET, FamiliesPackage.FAMILY_REGISTER__TEST, oldTest, test));
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	@Override
	public EList<Member> getFam()
	{
		if (fam == null) {
			fam = new EObjectContainmentEList<Member>(Member.class, this, FamiliesPackage.FAMILY_REGISTER__FAM);
		}
		return fam;
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	@Override
	public NotificationChain eInverseRemove(InternalEObject otherEnd, int featureID, NotificationChain msgs)
	{
		switch (featureID) {
			case FamiliesPackage.FAMILY_REGISTER__FAMILIES:
				return ((InternalEList<?>)getFamilies()).basicRemove(otherEnd, msgs);
			case FamiliesPackage.FAMILY_REGISTER__FAM:
				return ((InternalEList<?>)getFam()).basicRemove(otherEnd, msgs);
		}
		return super.eInverseRemove(otherEnd, featureID, msgs);
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	@Override
	public Object eGet(int featureID, boolean resolve, boolean coreType)
	{
		switch (featureID) {
			case FamiliesPackage.FAMILY_REGISTER__FAMILIES:
				return getFamilies();
			case FamiliesPackage.FAMILY_REGISTER__TEST:
				if (resolve) return getTest();
				return basicGetTest();
			case FamiliesPackage.FAMILY_REGISTER__FAM:
				return getFam();
		}
		return super.eGet(featureID, resolve, coreType);
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	@SuppressWarnings("unchecked")
	@Override
	public void eSet(int featureID, Object newValue)
	{
		switch (featureID) {
			case FamiliesPackage.FAMILY_REGISTER__FAMILIES:
				getFamilies().clear();
				getFamilies().addAll((Collection<? extends Family>)newValue);
				return;
			case FamiliesPackage.FAMILY_REGISTER__TEST:
				setTest((Member)newValue);
				return;
			case FamiliesPackage.FAMILY_REGISTER__FAM:
				getFam().clear();
				getFam().addAll((Collection<? extends Member>)newValue);
				return;
		}
		super.eSet(featureID, newValue);
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	@Override
	public void eUnset(int featureID)
	{
		switch (featureID) {
			case FamiliesPackage.FAMILY_REGISTER__FAMILIES:
				getFamilies().clear();
				return;
			case FamiliesPackage.FAMILY_REGISTER__TEST:
				setTest((Member)null);
				return;
			case FamiliesPackage.FAMILY_REGISTER__FAM:
				getFam().clear();
				return;
		}
		super.eUnset(featureID);
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	@Override
	public boolean eIsSet(int featureID)
	{
		switch (featureID) {
			case FamiliesPackage.FAMILY_REGISTER__FAMILIES:
				return families != null && !families.isEmpty();
			case FamiliesPackage.FAMILY_REGISTER__TEST:
				return test != null;
			case FamiliesPackage.FAMILY_REGISTER__FAM:
				return fam != null && !fam.isEmpty();
		}
		return super.eIsSet(featureID);
	}

} //FamilyRegisterImpl
