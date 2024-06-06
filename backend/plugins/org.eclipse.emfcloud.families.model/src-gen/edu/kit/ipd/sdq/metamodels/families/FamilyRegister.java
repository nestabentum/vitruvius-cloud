/**
 */
package edu.kit.ipd.sdq.metamodels.families;

import org.eclipse.emf.common.util.EList;

/**
 * <!-- begin-user-doc -->
 * A representation of the model object '<em><b>Family Register</b></em>'.
 * <!-- end-user-doc -->
 *
 * <p>
 * The following features are supported:
 * </p>
 * <ul>
 *   <li>{@link edu.kit.ipd.sdq.metamodels.families.FamilyRegister#getFamilies <em>Families</em>}</li>
 *   <li>{@link edu.kit.ipd.sdq.metamodels.families.FamilyRegister#getTest <em>Test</em>}</li>
 *   <li>{@link edu.kit.ipd.sdq.metamodels.families.FamilyRegister#getFam <em>Fam</em>}</li>
 * </ul>
 *
 * @see edu.kit.ipd.sdq.metamodels.families.FamiliesPackage#getFamilyRegister()
 * @model
 * @generated
 */
public interface FamilyRegister extends Identifiable
{
	/**
	 * Returns the value of the '<em><b>Families</b></em>' containment reference list.
	 * The list contents are of type {@link edu.kit.ipd.sdq.metamodels.families.Family}.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the value of the '<em>Families</em>' containment reference list.
	 * @see edu.kit.ipd.sdq.metamodels.families.FamiliesPackage#getFamilyRegister_Families()
	 * @model containment="true" ordered="false"
	 * @generated
	 */
	EList<Family> getFamilies();

	/**
	 * Returns the value of the '<em><b>Test</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the value of the '<em>Test</em>' reference.
	 * @see #setTest(Member)
	 * @see edu.kit.ipd.sdq.metamodels.families.FamiliesPackage#getFamilyRegister_Test()
	 * @model
	 * @generated
	 */
	Member getTest();

	/**
	 * Sets the value of the '{@link edu.kit.ipd.sdq.metamodels.families.FamilyRegister#getTest <em>Test</em>}' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @param value the new value of the '<em>Test</em>' reference.
	 * @see #getTest()
	 * @generated
	 */
	void setTest(Member value);

	/**
	 * Returns the value of the '<em><b>Fam</b></em>' containment reference list.
	 * The list contents are of type {@link edu.kit.ipd.sdq.metamodels.families.Member}.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the value of the '<em>Fam</em>' containment reference list.
	 * @see edu.kit.ipd.sdq.metamodels.families.FamiliesPackage#getFamilyRegister_Fam()
	 * @model containment="true" ordered="false"
	 * @generated
	 */
	EList<Member> getFam();

} // FamilyRegister
